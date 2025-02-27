import { ApiError } from "../errors/api-error";
import { IGroupInterface } from "../interfaces/group.interface";
import { groupsRepository } from "../repositories/groups.repository";

class GroupsService {
  public async getGroups(): Promise<IGroupInterface[]> {
    const groups = await groupsRepository.getGroups();
    if (!groups) {
      throw new ApiError("Groups not found", 404);
    }

    return groups;
  }

  public async addGroup(group: IGroupInterface): Promise<IGroupInterface> {
    const response = await groupsRepository.addGroup(group);
    if (!response) {
      throw new ApiError("Cannot add group", 500);
    }

    return response;
  }
}

export const groupsService = new GroupsService();
