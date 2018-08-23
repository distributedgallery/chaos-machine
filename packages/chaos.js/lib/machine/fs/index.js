"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fs = {
    exists: (path) => {
        return fs_1.default.existsSync(path);
    },
    mkdir: (path) => {
        return fs_1.default.mkdirSync(path);
    },
    write: (path, buffer) => {
        fs_1.default.writeFileSync(path, buffer);
    }
};
exports.default = fs;
