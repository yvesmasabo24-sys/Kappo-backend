"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationFunction_1 = require("../middlewares/authenticationFunction");
const router = (0, express_1.Router)();
router.get("/test-user", authenticationFunction_1.requireSignin, (req, res) => {
    res.json({ message: "Middleware works!", user: req.user });
});
router.get("/test-admin", authenticationFunction_1.requireSignin, authenticationFunction_1.checkAdmin, (req, res) => {
    res.json({ message: "Admin middleware works!", user: req.user });
});
exports.default = router;
