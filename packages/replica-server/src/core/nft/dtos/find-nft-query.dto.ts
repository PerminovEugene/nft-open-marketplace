import { IsOptional, IsString } from 'class-validator';

export class FindNftQueryDto {
  @IsOptional()
  @IsString()
  ownerAddress?: string;

  @IsOptional()
  @IsString()
  sellerAddress?: string;
}