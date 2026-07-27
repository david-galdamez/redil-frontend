export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: number;
  redilId: number;
}

export interface JwtUser {
  id: string;
  email: string;
  name: string;
  role: string;
  redil_id?: string;
}

export interface UserDetailsDto {
  name: string;
  email: string;
  role: string;
  redilName: string;
  redilId: number | null;
}
