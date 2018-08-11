"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_parse_1 = __importDefault(require("url-parse"));
var truffle_contract_1 = __importDefault(require("truffle-contract"));
var ipfs_api_1 = __importDefault(require("ipfs-api"));
var eth_crypto_1 = __importDefault(require("eth-crypto"));
var web3_1 = __importDefault(require("web3"));
var Chaos = /** @class */ (function () {
    function Chaos(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.ipfs, ipfs = _c === void 0 ? 'https://ipfs.infura.io:5001' : _c, _d = _b.ethereum, ethereum = _d === void 0 ? 'https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09' : _d, _e = _b.address, address = _e === void 0 ? '0x7e8dcb7432b8356635f2820b8e92fa6d760609fe' : _e;
        // IPFS
        var url = url_parse_1.default(ipfs);
        this.ipfs = ipfs_api_1.default(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) });
        // web3
        this.provider = new web3_1.default.providers.HttpProvider(ethereum);
        // abstraction
        this.abstraction = truffle_contract_1.default(require('@chaosmachine/core/build/contracts/Chaos.json'));
        this.abstraction.setProvider(this.provider);
        // contract
        this.contract = this.abstraction.at(address);
    }
    Chaos.prototype.watch = function (cb) {
        var event = this.contract.TokenGranted();
        event.watch(cb);
    };
    Chaos.prototype.generateToken = function () {
        return eth_crypto_1.default.createIdentity();
    };
    Chaos.prototype.registerToken = function (address, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.grantToken(address, opts)];
                    case 1:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    Chaos.prototype.uploadTrack = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ipfs.files.add(buffer, { pin: true })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results[0].hash];
                }
            });
        });
    };
    Chaos.prototype.registerTrack = function (cid, privateKey, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var message, hash, signature, estimate, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = 'kittiesarefordummies';
                        hash = eth_crypto_1.default.hash.keccak256(message);
                        signature = eth_crypto_1.default.sign(privateKey, hash);
                        return [4 /*yield*/, this.contract.addTrack.estimateGas(hash, signature, cid)];
                    case 1:
                        estimate = _a.sent();
                        opts = __assign({ gas: 2 * estimate }, opts);
                        return [4 /*yield*/, this.contract.addTrack(hash, signature, cid, opts)];
                    case 2:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    return Chaos;
}());
exports.default = Chaos;
