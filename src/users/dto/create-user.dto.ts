import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export const USER_ROLES = ['operator', 'manager', 'analyst', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(USER_ROLES)
  role: UserRole;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @ValidateIf((dto: CreateUserDto) => dto.role !== 'admin')
  @IsInt()
  @IsNotEmpty()
  branch_id?: number;
}
