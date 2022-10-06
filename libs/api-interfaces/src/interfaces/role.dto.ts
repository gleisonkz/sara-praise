import { IsBoolean, IsNumber, IsString } from 'class-validator';

export interface IRoleResponse {
  roleID: number;
  name: string;
  iconUrl: string;
  isChecked: boolean;
}

export class RoleResponse implements IRoleResponse {
  @IsNumber()
  roleID: number;

  @IsString()
  name: string;

  @IsString()
  iconUrl: string;

  @IsBoolean()
  isChecked: boolean;
}
