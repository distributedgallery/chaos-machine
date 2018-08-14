"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ipfs_api_1 = __importDefault(require("ipfs-api"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var truffle_contract_1 = __importDefault(require("truffle-contract"));
var truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
var url_parse_1 = __importDefault(require("url-parse"));
var util_1 = __importDefault(require("util"));
var web3_1 = __importDefault(require("web3"));
var audio_1 = __importDefault(require("./audio"));
var cash_1 = __importDefault(require("./devices/cash"));
var printer_1 = __importDefault(require("./devices/printer"));
var fs_1 = __importDefault(require("./fs"));
var log_1 = __importDefault(require("./log"));
var token_1 = __importDefault(require("./token"));
var track_1 = __importDefault(require("./track"));
var Lcd;
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(os_1.default.type() === 'Linux')) return [3 /*break*/, 2];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./devices/lcd')); })];
            case 1:
                Lcd = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./devices/lcd-spoof')); })];
            case 3:
                Lcd = _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); })();
/* tslint:enable:statements-aligned*/
var DEFAULTS = {
    ADDRESS: '0x7e8dcb7432b8356635f2820b8e92fa6d760609fe',
    DEVICES: false,
    ETHEREUM: 'https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09',
    IPFS: 'https://ipfs.infura.io:5001',
    MNEMONIC: 'journey nice rather ball theme used uncover gate pond rifle between state',
};
var Machine = /** @class */ (function () {
    function Machine(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.ipfs, ipfs = _c === void 0 ? DEFAULTS.IPFS : _c, _d = _b.ethereum, ethereum = _d === void 0 ? DEFAULTS.ETHEREUM : _d, _e = _b.mnemonic, mnemonic = _e === void 0 ? DEFAULTS.MNEMONIC : _e, _f = _b.address, address = _f === void 0 ? DEFAULTS.ADDRESS : _f, _g = _b.devices, devices = _g === void 0 ? DEFAULTS.DEVICES : _g;
        var _this = this;
        // IPFS
        var url = url_parse_1.default(ipfs);
        this.ipfs = ipfs_api_1.default(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) });
        // mnemonic
        this.mnemonic = mnemonic;
        // HDWallet provider
        this.provider = new truffle_hdwallet_provider_1.default(mnemonic, ethereum);
        // abstraction
        this.abstraction = truffle_contract_1.default(require('@chaosmachine/core/build/contracts/Chaos.json'));
        this.abstraction.setProvider(this.provider);
        // contract
        this.contract = this.abstraction.at(address);
        // utils
        this.fs = fs_1.default;
        this.paths = {
            log: path_1.default.join(os_1.default.homedir(), '.chaos', 'log'),
            root: path_1.default.join(os_1.default.homedir(), '.chaos'),
            tracks: path_1.default.join(os_1.default.homedir(), '.chaos', 'tracks'),
        };
        this.log = new log_1.default(this);
        this.track = new track_1.default(this);
        this.audio = new audio_1.default(this);
        this.token = new token_1.default(this);
        // devices
        if (devices) {
            this.cash = new cash_1.default({ port: '/dev/cash' });
            this.printer = new printer_1.default({ port: '/dev/printer' });
            this.lcd = new Lcd({ rs: 25, e: 24, data: [23, 17, 27, 22] });
            // this.fans 		= new Relay({ pin: 4 })
            // this.resistor = new Relay({ pin: 3 })
            //
            this.cash.on('ready', function () { return _this.log.info('[cash][ready]'); });
            this.printer.on('ready', function () { return _this.log.info('[printer][ready]'); });
            this.lcd.on('ready', function () {
                _this.log.info('[lcd][ready]');
                _this.lcd.write('Welcome chaos', function (err) {
                    _this.log.error(err.toString());
                });
            });
            process.on('SIGINT', function () { return process.exit(0); });
            process.on('uncaughtException', function (err) {
                _this.log.error(err.toString());
                setTimeout(function () {
                    process.exit(1);
                }, 500);
            });
            process.on('exit', function () {
                _this.cash.close();
                _this.printer.close();
                _this.lcd.close();
                _this.fans.close();
                _this.resistor.close();
            });
        }
    }
    Machine.launch = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var machine, web3, accounts, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        machine = new Machine(opts);
                        web3 = new web3_1.default(machine.provider);
                        return [4 /*yield*/, util_1.default.promisify(web3.eth.getAccounts)()];
                    case 1:
                        accounts = _a.sent();
                        if (!machine.fs.exists(machine.paths.root)) {
                            machine.fs.mkdir(machine.paths.root);
                        }
                        if (!machine.fs.exists(machine.paths.tracks)) {
                            machine.fs.mkdir(machine.paths.tracks);
                        }
                        machine.abstraction.defaults({ from: accounts[0] });
                        event = machine.contract.TokenGranted({}, { fromBlock: 'latest', toBlock: 'latest' });
                        event.watch(function (err, result) {
                            if (err) {
                                machine.log.error(err);
                            }
                            else {
                                machine.log.info('[event][TokenGranted][machine:' +
                                    result.args.machine +
                                    '][token:' +
                                    result.args.token +
                                    ']');
                                machine.audio.shuffle();
                            }
                        });
                        return [2 /*return*/, machine];
                }
            });
        });
    };
    return Machine;
}());
exports.default = Machine;
