"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Log = /** @class */ (function () {
    function Log(machine) {
        this.machine = machine;
    }
    Log.prototype.info = function (message) {
        var _this = this;
        var line = '[' + new Date(Date.now()).toISOString() + ']' + message + '\n';
        console.log(line);
        fs_1.default.appendFile(this.machine.paths['log'], line, function (err) {
            if (err) {
                _this.error(message);
            }
        });
    };
    Log.prototype.error = function (message) {
        var line = '[' + new Date(Date.now()).toISOString() + ']' + '[error]' + message + '\n';
        console.log(line);
        fs_1.default.appendFile(this.machine.paths['log'], line, function (err) {
            if (err) {
                console.log(err);
            }
        });
    };
    return Log;
}());
exports.default = Log;
