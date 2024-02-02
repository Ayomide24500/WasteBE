"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const userRouter_1 = __importDefault(require("./router/userRouter"));
const mainError_1 = require("./error/mainError");
const enums_1 = require("./utils/enums");
const handleError_1 = require("./error/handleError");
const mainApp = (app) => {
    app.use("/api/user", userRouter_1.default);
    try {
        app.get("/", (req, res) => {
            try {
                res.status(200).json({
                    message: "Welcome to Awesome Api",
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Error",
                });
            }
        });
        app.all("*", (req, res, next) => {
            next(new mainError_1.mainError({
                name: "Route Error",
                message: `this endpoint you entered ${req.originalUrl} doesn't exit`,
                status: enums_1.HTTP.BAD,
                success: false,
            }));
        });
        app.use(handleError_1.handleError);
    }
    catch (error) {
        return error;
    }
};
exports.mainApp = mainApp;
