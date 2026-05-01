import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tributeRouter from "./tribute";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tribute", tributeRouter);

export default router;
