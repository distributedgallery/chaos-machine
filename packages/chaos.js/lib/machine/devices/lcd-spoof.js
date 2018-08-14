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
var events_1 = __importDefault(require("events"));
var LCDSpoof = /** @class */ (function (_super) {
    __extends(LCDSpoof, _super);
    function LCDSpoof(opts) {
        return _super.call(this) || this;
    }
    LCDSpoof.prototype.write = function (text, cb) { };
    LCDSpoof.prototype.close = function () { };
    return LCDSpoof;
}(events_1.default));
exports.default = LCDSpoof;
