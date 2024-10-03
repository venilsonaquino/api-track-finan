import { UserPlan } from 'src/common/enums/user-plan.enum';
import { ulid } from 'ulid';

export class UserEntity {
  id: string;
  email: string;
  password: string;
  fullName: string;
  plan: UserPlan;
  refreshToken?: string;

  constructor(params: Partial<{
    id: string;
    email: string;
    password: string;
    fullName: string;
    plan: UserPlan;
    refreshToken?: string;
  }>) {
    this.id = params.id || ulid();
    this.email = params.email;
    this.password = params.password;
    this.fullName = params.fullName;
    this.plan = params.plan || UserPlan.Free;
    this.refreshToken = params.refreshToken;
  }
}