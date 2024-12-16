import { IManagerInterface } from "../interfaces/manager.interface";
import { ManagerModel } from "../models/ManagerModel";

class ManagerRepository {
  public async create(dto: IManagerInterface): Promise<IManagerInterface> {
    return await ManagerModel.create(dto);
  }

  public async getByParams(
    params: Partial<IManagerInterface>,
  ): Promise<IManagerInterface> {
    return await ManagerModel.findOne(params);
  }
}

export const managerRepository = new ManagerRepository();
