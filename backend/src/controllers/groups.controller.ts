import { NextFunction, Request, Response } from "express";

import { IGroupInterface } from "../interfaces/group.interface";
import { groupsService } from "../services/groups.service";

class GroupsController {
  public async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await groupsService.getGroups();
      res.status(200).json(groups);
    } catch (e) {
      next(e);
    }
  }

  public async addGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = req.body as IGroupInterface;
      const response = await groupsService.addGroup(group);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const groupsController = new GroupsController();
