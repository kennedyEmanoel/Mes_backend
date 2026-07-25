export class CreateUserDto {
    name: string;
    registration_number: string;
    role: string;
    email: string;
    password: string;
    branch_id?: number;
}
