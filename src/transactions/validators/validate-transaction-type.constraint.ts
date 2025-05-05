import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'TransactionType', async: false })
export class TransactionTypeConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    return !(object.isInstallment && object.isRecurring); // Ambos true? inválido
  }

  defaultMessage(): string {
    return 'You cannot have both isRecurring and isInstallment set to true.';
  }
}