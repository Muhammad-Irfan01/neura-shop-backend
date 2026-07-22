import { IsString, IsNotEmpty } from 'class-validator';

export class RecommendationsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
