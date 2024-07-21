"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/:userId', (req, res) => {
    res.send('getUser');
});
router.put('/:userId', (req, res) => {
    res.send('update user');
});
router.delete('/:userId', (req, res) => {
    res.send('delete user');
});
module.exports = router;
