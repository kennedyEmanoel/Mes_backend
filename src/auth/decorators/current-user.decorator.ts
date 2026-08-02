import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../users/dto/create-user.dto';

export interface AuthenticatedUser {
  userId: number;
  registrationNumber: string;
  role: UserRole;
  branchId: number | null;
}

interface RequestWithUser {
  user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
