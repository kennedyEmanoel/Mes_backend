import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStepTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
