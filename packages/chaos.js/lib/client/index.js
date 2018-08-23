"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipfs_api_1 = __importDefault(require("ipfs-api"));
const truffle_contract_1 = __importDefault(require("truffle-contract"));
const url_parse_1 = __importDefault(require("url-parse"));
const web3_1 = __importDefault(require("web3"));
const track_1 = __importDefault(require("./track"));
class Client {
    constructor({ ipfs = Client.defaults.ipfs, provider = Client.defaults.provider, contract = Client.defaults.contract } = {}) {
        // IPFS
        const url = url_parse_1.default(ipfs);
        this.ipfs = ipfs_api_1.default(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) });
        // provider
        this.provider = provider;
        // abstraction
        this.abstraction = truffle_contract_1.default(require('@chaosmachine/core/build/contracts/Chaos.json'));
        this.abstraction.setProvider(this.provider);
        // contract
        this.contract = this.abstraction.at(contract);
        // track
        this.track = new track_1.default(this);
    }
}
Client.defaults = {
    contract: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
    ipfs: 'https://ipfs.infura.io:5001',
    provider: new web3_1.default.providers.HttpProvider('http://localhost:8545')
};
exports.default = Client;
