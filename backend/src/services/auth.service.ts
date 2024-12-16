import { ApiError } from "../errors/api-error";
import { ILogin, IManagerInterface } from "../interfaces/manager.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { managerRepository } from "../repositories/manager.repository";
import { tokenRepository } from "../repositories/token.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signIn(
    dto: ILogin,
  ): Promise<{ manager: IManagerInterface; tokens: ITokenPair }> {
    const manager = await managerRepository.getByParams({ email: dto.email });
    if (!manager) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      manager.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    const tokens = await tokenService.generateTokenPair({
      managerId: manager._id,
      role: manager.role,
    });

    await tokenRepository.create({ ...tokens, _managerId: manager._id });
    return { manager, tokens };
  }

  public async refresh(
    payload: ITokenPayload,
    oldTokenId: string,
  ): Promise<ITokenPair> {
    const tokens = await tokenService.generateTokenPair({
      managerId: payload.managerId,
      role: payload.role,
    });
    await tokenRepository.create({ ...tokens, _managerId: payload.managerId });
    await tokenRepository.deleteById(oldTokenId);
    return tokens;
  }
}

export const authService = new AuthService();
