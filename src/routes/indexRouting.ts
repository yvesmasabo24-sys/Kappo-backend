//all routing are going to be here to avoind confusion
//import router from "./routes/ProductRoute";  
import { Router } from "express";   
import userRouter from "./userpath";    

const mainRouter = Router();

//mainRouter.use("/products", router);
mainRouter.use("/users", userRouter);

export default mainRouter;