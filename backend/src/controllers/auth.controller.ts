import { NextFunction, Request, Response } from "express";

import { ILogin } from "../interfaces/manager.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { ManagerPresenter } from "../presenters/manager.presenter";
import { authService } from "../services/auth.service";

class AuthController {
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ILogin;
      const { manager, tokens } = await authService.signIn(dto);
      const result = ManagerPresenter.toAuthResponse(manager, tokens);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const oldTokensId = req.res.locals.oldTokensId as string;
      const result = await authService.refresh(jwtPayload, oldTokensId);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json();
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
