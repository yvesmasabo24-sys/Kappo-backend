import { Router, Response } from "express";
import { requireSignin, AuthRequest, checkAdmin } from "../middlewares/authenticationFunction";

const router = Router();

router.get("/test-user", requireSignin, (req: AuthRequest, res: Response) => {
  res.json({ message: "Middleware works!", user: req.user });
});

router.get("/test-admin", requireSignin, checkAdmin, (req: AuthRequest, res: Response) => {
  res.json({ message: "Admin middleware works!", user: req.user });
});

export default router;
