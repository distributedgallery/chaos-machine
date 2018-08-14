"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_crypto_1 = __importDefault(require("eth-crypto"));
class Track {
    constructor(client) {
        this.client = client;
    }
    async upload(buffer) {
        const results = await this.client.ipfs.files.add(buffer, { pin: true });
        return results[0].hash;
    }
    async register(cid, privateKey, opts) {
        const message = 'kittiesarefordummies';
        const hash = eth_crypto_1.default.hash.keccak256(message);
        const signature = eth_crypto_1.default.sign(privateKey, hash);
        const estimate = await this.client.contract.addTrack.estimateGas(hash, signature, cid);
        const receipt = await this.client.contract.addTrack(hash, signature, cid, Object.assign({ gas: 2 * estimate }, opts));
        return receipt;
    }
}
exports.default = Track;
