import { IsString, IsNotEmpty } from 'class-validator';

export class AnalyzeReviewDto {
  @IsString()
  @IsNotEmpty()
  reviewId: string;
}
