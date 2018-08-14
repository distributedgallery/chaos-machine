"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialport_1 = __importDefault(require("serialport"));
var qrcode_1 = __importDefault(require("qrcode"));
var thermalprinter_1 = __importDefault(require("thermalprinter"));
var events_1 = __importDefault(require("events"));
var Printer = /** @class */ (function (_super) {
    __extends(Printer, _super);
    function Printer(opts) {
        var _this = _super.call(this) || this;
        if (!opts.port)
            throw new Error('[Printer] Please specify a serial port!');
        _this.serialPort = new serialport_1.default(opts.port, {
            baudRate: 19200,
        });
        _this.serialPort.on('open', function () {
            _this.printer = new thermalprinter_1.default(_this.serialPort);
            _this.printer.on('ready', function () { return _this.emit('ready'); });
        });
        return _this;
    }
    Printer.prototype.print = function (text) {
        var _this = this;
        qrcode_1.default.toString(text, function (err, result) {
            var lines = result.split('\n');
            _this.printer.setLineSpacing(0);
            _this.printer.center();
            lines.forEach(function (line) { return _this.printer.printLine(line.substring(2, line.length - 2)); });
            _this.printer.writeCommands([27, 50]);
            _this.printer.lineFeed(2);
            _this.printer.print(function () { return _this.emit('done', text); });
        });
    };
    Printer.prototype.close = function () {
        if (this.serialPort && this.serialPort.isOpened)
            this.serialPort.close();
    };
    return Printer;
}(events_1.default));
exports.default = Printer;
