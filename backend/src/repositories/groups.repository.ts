import { IGroupInterface } from "../interfaces/group.interface";
import { GroupModel } from "../models/GroupModel";

class GroupsRepository {
  public getGroups(): Promise<IGroupInterface[]> {
    return GroupModel.find();
  }

  public async addGroup(group: IGroupInterface): Promise<IGroupInterface> {
    return await GroupModel.create(group);
  }
}

export const groupsRepository = new GroupsRepository();
