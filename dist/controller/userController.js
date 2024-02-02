"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../model/userModel"));
const enums_1 = require("../utils/enums");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const AdminCode = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            email,
            password: hashedPassword,
            AdminCode,
            token,
        });
        return res.status(enums_1.HTTP.CREATED).json({
            message: "user created successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(enums_1.HTTP.BAD).json({
            message: "Error creating user",
        });
    }
});
exports.createUser = createUser;
