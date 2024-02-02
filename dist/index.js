"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mainApp_1 = require("./mainApp");
const dbConfig_1 = require("./utils/dbConfig");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
app.use((0, express_1.default)());
app.use((0, cors_1.default)());
(0, mainApp_1.mainApp)(app);
const server = app.listen(2233, () => {
    console.clear();
    console.log("save");
    (0, dbConfig_1.dbConfig)();
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException", error);
    process.exit(1);
});
process.on("rejectionHandled", (reason) => {
    console.log("rejectionHandled", reason);
    server.close(() => {
        process.exit(1);
    });
});
