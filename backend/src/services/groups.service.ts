import { IGroupInterface } from "../interfaces/group.interface";
import { groupsRepository } from "../repositories/groups.repository";

class GroupsService {
  public async getGroups(): Promise<IGroupInterface[]> {
    const groups = await groupsRepository.getGroups();
    return groups;
  }

  public async addGroup(group: IGroupInterface): Promise<IGroupInterface> {
    return await groupsRepository.addGroup(group);
  }
}

export const groupsService = new GroupsService();
