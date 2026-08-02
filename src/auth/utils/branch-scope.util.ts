import { AuthenticatedUser } from '../decorators/current-user.decorator';

export function branchScope(
  user: AuthenticatedUser,
): { branchId: number } | Record<string, never> {
  if (user.role === 'admin') {
    return {};
  }
  return { branchId: user.branchId };
}

export function productionOrderBranchScope(
  user: AuthenticatedUser,
): { productionOrder: { branchId: number } } | Record<string, never> {
  if (user.role === 'admin') {
    return {};
  }
  return { productionOrder: { branchId: user.branchId } };
}
