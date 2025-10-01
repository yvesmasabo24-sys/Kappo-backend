import { Router } from "express";
import { signin, login } from "../controllers/userController";

const router = Router();

router.post("/register", signin);
router.post("/login", login);

export default router;
