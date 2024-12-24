import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { configs } from "./configs/configs";
import swaggerSpec from "./docs/swagger.json";
import { ApiError } from "./errors/api-error";
import { createFirstManager } from "./helpers/createFirstAdmin";
import { authRouter } from "./routers/auth.router";
import { orderRouter } from "./routers/order.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/orders", orderRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json(err.message);
  },
);

process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e.message, e.stack);
  process.exit(1);
});

app.listen(configs.APP_PORT, configs.APP_HOST, async () => {
  await mongoose.connect(configs.MONGO_URL);
  console.log("Database available");
  console.log(`Server is running on port ${configs.APP_PORT}`);
  await createFirstManager();
});
