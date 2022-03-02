export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}
export interface SignUpResponse extends Omit<SignUpRequest, 'password'> {
  userID: number;
}

export interface SignInRequest extends Omit<SignUpRequest, 'name'> {}
