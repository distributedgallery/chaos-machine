"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ipfs_api_1 = __importDefault(require("ipfs-api"));
var truffle_contract_1 = __importDefault(require("truffle-contract"));
var url_parse_1 = __importDefault(require("url-parse"));
var web3_1 = __importDefault(require("web3"));
var track_1 = __importDefault(require("./track"));
var DEFAULTS = {
    ADDRESS: '0x7e8dcb7432b8356635f2820b8e92fa6d760609fe',
    IPFS: 'https://ipfs.infura.io:5001',
    PROVIDER: new web3_1.default.providers.HttpProvider('http://localhost:8545'),
};
var Client = /** @class */ (function () {
    function Client(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.ipfs, ipfs = _c === void 0 ? DEFAULTS.IPFS : _c, _d = _b.provider, provider = _d === void 0 ? DEFAULTS.PROVIDER : _d, _e = _b.address, address = _e === void 0 ? DEFAULTS.ADDRESS : _e;
        // IPFS
        var url = url_parse_1.default(ipfs);
        this.ipfs = ipfs_api_1.default(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) });
        // provider
        this.provider = provider;
        // abstraction
        this.abstraction = truffle_contract_1.default(require('@chaosmachine/core/build/contracts/Chaos.json'));
        this.abstraction.setProvider(this.provider);
        // contract
        this.contract = this.abstraction.at(address);
        // track
        this.track = new track_1.default(this);
    }
    return Client;
}());
exports.default = Client;
