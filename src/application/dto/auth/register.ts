import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  firstNames?: string;

  @IsOptional()
  @IsString()
  lastNames?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
