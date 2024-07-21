"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const userRouter = require('./routes/user');
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.use('/user', userRouter);
app.listen(port, () => {
    console.log(`[Server]: Server is running at http://localhost:${port}`);
});
