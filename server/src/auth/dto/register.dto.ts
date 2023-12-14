import { IsEmail, IsNotEmpty ,MinLength,Validate} from 'class-validator';
import { uniqueEmailValidation } from 'src/validations/uniqueEmail.validation';

export class registerDto {
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @MinLength(3)
  @IsNotEmpty()
  user_name: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @Validate(uniqueEmailValidation)
  email: string;
}