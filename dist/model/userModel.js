"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userModel = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    AdminCode: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        default: "Admin",
    },
    verify: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Admin", userModel);
