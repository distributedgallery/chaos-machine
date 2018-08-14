"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var fs = {
    write: function (path, buffer) {
        fs_1.default.writeFileSync(path, buffer);
    },
    exists: function (path) {
        return fs_1.default.existsSync(path);
    },
    mkdir: function (path) {
        return fs_1.default.mkdirSync(path);
    }
};
exports.default = fs;
