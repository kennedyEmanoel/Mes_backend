import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignUserDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
