import { RoleEnum } from "../enums/role.enum";
import { ManagerModel } from "../models/ManagerModel";
import { managerRepository } from "../repositories/manager.repository";
import { passwordService } from "../services/password.service";

const dto = {
  name: "admin",
  surname: "admin",
  email: "admin@gmail.com",
  password: "admin",
  role: RoleEnum.ADMIN,
  isActive: true,
};

export const createFirstManager = async (): Promise<void> => {
  const manager = await ManagerModel.countDocuments({});
  const password = await passwordService.hashPassword(dto.password);
  if (!manager) {
    await managerRepository.create({ ...dto, password });
  }
};
