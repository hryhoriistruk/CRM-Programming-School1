import joi from "joi";

import { regexConstant } from "../constants/regexp.constants";
// import {RoleEnum} from "../enums/role.enum";

export class ManagerValidator {
  // private static name = joi.string().min(3).trim();
  private static email = joi.string().lowercase().regex(regexConstant.EMAIL);
  private static password = joi.string().trim();
  // private static role = joi.string().valid(RoleEnum.ADMIN, RoleEnum.MANAGER);

  public static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
}
