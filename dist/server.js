"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const databaseConfiguration_1 = require("./config/databaseConfiguration");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute")); // ✅ import product routes
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const indexRouting_1 = __importDefault(require("./routes/indexRouting"));
const contactRoute_1 = __importDefault(require("./routes/contactRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, databaseConfiguration_1.connectDB)();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// ✅ Existing routes
app.use("/api-v1/users", authRoute_1.default);
// ✅ Product routes
app.use("/api-v1/products", productRoute_1.default);
// ✅ Cart routes
app.use("/api-v1/cart", cartRoute_1.default);
// ✅ Add order routes
app.use("/api-v1/orders", orderRoute_1.default);
//testing routes
app.use("/api-v1/test", testRoutes_1.default);
app.use("/api-v1", indexRouting_1.default);
app.use("/api-v1/contact", contactRoute_1.default);
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
