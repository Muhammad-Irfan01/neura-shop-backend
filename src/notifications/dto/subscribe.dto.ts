import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class SubscribeDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsEnum(['push', 'email', 'sms'])
  type: 'push' | 'email' | 'sms';
}
