"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controllers/ProductController");
const authenticationFunction_1 = require("../middlewares/authenticationFunction");
///import parser from "../middlewares/multerCloudinary";
const router = express_1.default.Router();
// Public routes
router.get("/", ProductController_1.getProducts);
router.get("/featured", ProductController_1.getFeaturedProducts);
router.get("/:id", ProductController_1.getProductById);
// Admin routes
router.post("/create", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, ProductController_1.createProduct);
router.put("/:id", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, ProductController_1.updateProduct);
router.delete("/:id", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, ProductController_1.deleteProduct);
exports.default = router;
