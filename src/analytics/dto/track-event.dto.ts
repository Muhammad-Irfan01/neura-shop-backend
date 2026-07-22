import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class TrackEventDto {
  @IsNotEmpty()
  @IsString()
  event: string;

  @IsNotEmpty()
  @IsObject()
  data: any;
}
