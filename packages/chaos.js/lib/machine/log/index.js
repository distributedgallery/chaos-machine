"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Log {
    constructor(machine) {
        this.machine = machine;
    }
    info(message) {
        const line = '[' + new Date(Date.now()).toISOString() + ']' + message + '\n';
        console.log(line);
        fs_1.default.appendFile(this.machine.paths['log'], line, (err) => {
            if (err) {
                this.error(message);
            }
        });
    }
    error(message) {
        const line = '[' + new Date(Date.now()).toISOString() + ']' + '[error]' + message + '\n';
        console.log(line);
        fs_1.default.appendFile(this.machine.paths['log'], line, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.default = Log;
