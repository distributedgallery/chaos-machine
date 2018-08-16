"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const columnify_1 = __importDefault(require("columnify"));
const fs_1 = __importDefault(require("fs"));
class Log {
    constructor(machine) {
        this.machine = machine;
    }
    info(event, args) {
        const data = [{ level: chalk_1.default.green('INFO'), timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }];
        const dataRaw = [{ level: 'INFO', timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }];
        for (const arg in args) {
            data[0][arg] = chalk_1.default.green(arg) + '=' + args[arg];
        }
        for (const arg in args) {
            dataRaw[0][arg] = arg + '=' + args[arg];
        }
        const line = columnify_1.default(data, { showHeaders: false, config: { event: { minWidth: 30 } } });
        const lineRaw = columnify_1.default(dataRaw, { showHeaders: false, config: { event: { minWidth: 30 } } }) + '\n';
        console.log(line);
        fs_1.default.appendFile(this.machine.paths['log'], lineRaw, (err) => {
            if (err) {
                this.error('Log', { error: err });
            }
        });
    }
    error(event, args) {
        const data = [{ level: chalk_1.default.red('ERR'), timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }];
        const dataRaw = [{ level: 'ERR', timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }];
        for (const arg in args) {
            data[0][arg] = chalk_1.default.red(arg) + '=' + args[arg];
        }
        for (const arg in args) {
            dataRaw[0][arg] = arg + '=' + args[arg];
        }
        const line = columnify_1.default(data, { showHeaders: false, config: { event: { minWidth: 30 } } });
        const lineRaw = columnify_1.default(dataRaw, { showHeaders: false, config: { event: { minWidth: 30 } } }) + '\n';
        console.log(line);
        fs_1.default.appendFile(this.machine.paths['log'], lineRaw, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.default = Log;
