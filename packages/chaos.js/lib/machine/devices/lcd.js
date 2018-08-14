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
// const Lcd = require('lcd')
var lcd_1 = __importDefault(require("lcd"));
var events_1 = __importDefault(require("events"));
var LCD = /** @class */ (function (_super) {
    __extends(LCD, _super);
    function LCD(opts) {
        var _this = _super.call(this) || this;
        if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4) {
            throw new Error('[Lcd] Please specifiy the correct pins!');
        }
        _this.lcd = new lcd_1.default(opts);
        _this.lcd.on('ready', function () { return _this.emit('ready'); });
        return _this;
    }
    LCD.prototype.write = function (text, cb) {
        this.lcd.setCursor(0, 0);
        this.lcd.print(text, function (err) { return cb && cb(err); });
    };
    LCD.prototype.close = function () {
        if (this.lcd)
            this.lcd.close();
    };
    return LCD;
}(events_1.default));
exports.default = LCD;
