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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ssp_1 = __importDefault(require("@xavier.seignard/ssp"));
var events_1 = __importDefault(require("events"));
var notes = {
    1: { value: 5, display: '5€' },
    2: { value: 10, display: '10€' },
    3: { value: 20, display: '20€' },
    4: { value: 50, display: '50€' },
    5: { value: 100, display: '100€' },
    6: { value: 500, display: '500€' },
};
var Cash = /** @class */ (function (_super) {
    __extends(Cash, _super);
    function Cash(opts) {
        var _this = _super.call(this) || this;
        if (!opts.port)
            throw new Error('[Cash] Please specify a serial port!');
        _this.ssp = new ssp_1.default({
            device: opts.port,
            type: 'nv10usb',
            currencies: [1, 1, 1, 1, 1, 1],
        });
        _this.ssp.init(true, function () {
            _this.ssp.on('ready', function () {
                _this.ssp.enable(function () { return _this.emit('ready'); });
            });
            _this.ssp.on('read_note', function (id) {
                if (id > 0)
                    _this.emit('read', __assign({ id: id }, notes[id]));
            });
            _this.ssp.on('credit_note', function (id) {
                if (id > 0)
                    _this.emit('accepted', __assign({ id: id }, notes[id]));
            });
        });
        return _this;
    }
    Cash.prototype.close = function () {
        if (this.ssp.port && this.ssp.port.isOpened)
            this.ssp.disable();
    };
    return Cash;
}(events_1.default));
exports.default = Cash;
