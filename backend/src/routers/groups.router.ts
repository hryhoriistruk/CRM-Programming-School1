import { Router } from "express";

import { groupsController } from "../controllers/groups.controller";

const router = Router();

router.get("/", groupsController.getGroups);
router.post("/addGroup", groupsController.addGroup);

export const groupsRouter = router;
