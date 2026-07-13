import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOperatorDto } from '../../../application/dto/admin/create-operator';
import { CreateOperatorUseCase } from '../../../application/use-cases/admin/create-operator';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import type { RegisteredUser } from '../../../domain/models/auth/registered-user';
import type { CreateOperatorInput } from '../../../domain/ports/output/auth-repository';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Roles } from '../../http/auth/decorators/roles';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/users')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly createOperatorUseCase: CreateOperatorUseCase) {}

  @Post('operators')
  async createOperator(
    @Body() body: CreateOperatorDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<RegisteredUser> {
    const input: CreateOperatorInput = {
      email: body.email,
      password: body.password,
      firstNames: body.firstNames,
      lastNames: body.lastNames,
      phone: body.phone,
      assignedBy: user.id,
    };

    const operator: unknown = await this.createOperatorUseCase.execute(input);

    if (!this.isRegisteredUser(operator)) {
      throw new InternalServerErrorException('Invalid operator response');
    }

    return operator;
  }

  private isRegisteredUser(value: unknown): value is RegisteredUser {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<RegisteredUser>;

    return (
      typeof candidate.id === 'string' &&
      (typeof candidate.email === 'string' || candidate.email === null)
    );
  }
}
