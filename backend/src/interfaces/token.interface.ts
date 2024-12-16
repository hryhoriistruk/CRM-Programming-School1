import { RoleEnum } from "../enums/role.enum";
import { IManagerInterface } from "./manager.interface";

export interface ITokenInterface {
  _id?: string;
  accessToken: string;
  refreshToken: string;
  _managerId: string | IManagerInterface;
}

export interface ITokenPayload {
  managerId: string;
  role: RoleEnum;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
