"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationFunction_1 = require("../middlewares/authenticationFunction");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// User routes
router.post("/create", authenticationFunction_1.requireSignin, orderController_1.createOrder);
router.get("/my-orders", authenticationFunction_1.requireSignin, orderController_1.getUserOrders);
// Admin routes
router.get("/all", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, orderController_1.getAllOrders);
router.put("/:id/status", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, orderController_1.updateOrderStatus);
exports.default = router;
