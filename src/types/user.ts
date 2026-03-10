export interface UserDto {
    id: number,
    name: string,
    email: string,
    role: number,
    redilId: number
}

export interface JwtUser {
    id: string;
    email: string;
    role: string;
    redil_id?: string
}