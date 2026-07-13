import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GetCurrentUserUseCase } from '../../../../application/use-cases/auth/get-current-user';
import { AuthenticatedUser } from '../../../../domain/models/auth/authenticated-user';
import { PERMISSIONS_KEY } from '../decorators/permissions';
import { ROLES_KEY } from '../decorators/roles';

type RequestWithUser = {
  user?: AuthenticatedUser;
};

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      return false;
    }

    const currentUser = await this.getCurrentUserUseCase.execute(request.user);
    const userRoles = new Set(currentUser.roles.map((role) => role.key));
    const userPermissions = new Set(
      currentUser.permissions.map((permission) => permission.key),
    );

    const hasRole =
      !requiredRoles?.length ||
      requiredRoles.some((role) => userRoles.has(role));
    const hasPermission =
      !requiredPermissions?.length ||
      requiredPermissions.every((permission) =>
        userPermissions.has(permission),
      );

    return hasRole && hasPermission;
  }
}
