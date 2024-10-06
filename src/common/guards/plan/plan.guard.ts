import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserPlan } from 'src/common/enums/user-plan.enum';

@Injectable()
export class PlanGuard implements CanActivate {
  private allowedPlans: UserPlan[];

  constructor(allowedPlans: UserPlan[]) {
    this.allowedPlans = allowedPlans;
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as { plan: UserPlan };;

    if (!user || !this.allowedPlans.includes(user.plan)) {
      throw new ForbiddenException('Access denied. Insufficient plan.');
    }

    return true;
  }
}
