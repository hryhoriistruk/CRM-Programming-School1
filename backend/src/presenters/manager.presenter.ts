import {
  IAuthResponse,
  IManagerInterface,
  IManagerResponse,
} from "../interfaces/manager.interface";
import { ITokenPair } from "../interfaces/token.interface";

export class ManagerPresenter {
  public static toResponse(data: IManagerInterface): IManagerResponse {
    return {
      _id: data._id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public static toAuthResponse(
    data: IManagerInterface,
    tokens: ITokenPair,
  ): IAuthResponse {
    return {
      data: this.toResponse(data),
      tokens,
    };
  }
}
