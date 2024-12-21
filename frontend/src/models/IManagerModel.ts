import {RoleEnum} from "../enums/role.enum";
import {ITokenPair} from "./ITokenPair";

export interface IManagerInterface {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  role: RoleEnum;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthResponse {
  data: IManagerInterface;
  tokens: ITokenPair;
}