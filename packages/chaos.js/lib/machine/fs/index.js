"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fs = {
    write: (path, buffer) => {
        fs_1.default.writeFileSync(path, buffer);
    },
    exists: (path) => {
        return fs_1.default.existsSync(path);
    },
    mkdir: (path) => {
        return fs_1.default.mkdirSync(path);
    }
};
exports.default = fs;
