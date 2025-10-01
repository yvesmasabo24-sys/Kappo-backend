"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//all routing are going to be here to avoind confusion
//import router from "./routes/ProductRoute";  
const express_1 = require("express");
const userpath_1 = __importDefault(require("./userpath"));
const mainRouter = (0, express_1.Router)();
//mainRouter.use("/products", router);
mainRouter.use("/users", userpath_1.default);
exports.default = mainRouter;
