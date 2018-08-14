"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_crypto_1 = __importDefault(require("eth-crypto"));
class Token {
    constructor(machine) {
        this.machine = machine;
    }
    generate() {
        return eth_crypto_1.default.createIdentity();
    }
    async register(address, opts) {
        const estimate = await this.machine.contract.grantToken.estimateGas(address);
        const receipt = await this.machine.contract.grantToken(address, Object.assign({ gas: 2 * estimate }, opts));
        return receipt;
    }
}
exports.default = Token;
