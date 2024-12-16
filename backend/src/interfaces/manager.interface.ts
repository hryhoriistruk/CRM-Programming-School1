import { RoleEnum } from "../enums/role.enum";
import { ITokenPair } from "./token.interface";

export interface IManagerInterface {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  role: RoleEnum;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILogin {
  email: string;
  password?: string;
}

export interface IManagerResponse
  extends Pick<
    IManagerInterface,
    | "_id"
    | "name"
    | "surname"
    | "email"
    | "role"
    | "isActive"
    | "createdAt"
    | "updatedAt"
  > {}

export interface IAuthResponse {
  data: IManagerResponse;
  tokens: ITokenPair;
}
