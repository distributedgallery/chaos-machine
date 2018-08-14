"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const ipfs_api_1 = __importDefault(require("ipfs-api"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const truffle_contract_1 = __importDefault(require("truffle-contract"));
const truffle_hdwallet_provider_1 = __importDefault(require("truffle-hdwallet-provider"));
const url_parse_1 = __importDefault(require("url-parse"));
const util_1 = __importDefault(require("util"));
const web3_1 = __importDefault(require("web3"));
const audio_1 = __importDefault(require("./audio"));
const cash_1 = __importDefault(require("./devices/cash"));
const printer_1 = __importDefault(require("./devices/printer"));
const fs_1 = __importDefault(require("./fs"));
const log_1 = __importDefault(require("./log"));
const token_1 = __importDefault(require("./token"));
const track_1 = __importDefault(require("./track"));
let Lcd;
(async () => {
    if (os_1.default.type() === 'Linux') {
        Lcd = await Promise.resolve().then(() => __importStar(require('./devices/lcd')));
    }
    else {
        Lcd = await Promise.resolve().then(() => __importStar(require('./devices/lcd-spoof')));
    }
})();
/* tslint:enable:statements-aligned*/
const DEFAULTS = {
    ADDRESS: '0x7e8dcb7432b8356635f2820b8e92fa6d760609fe',
    DEVICES: false,
    ETHEREUM: 'https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09',
    IPFS: 'https://ipfs.infura.io:5001',
    MNEMONIC: 'journey nice rather ball theme used uncover gate pond rifle between state',
};
class Machine {
    static async launch(opts) {
        const machine = new Machine(opts);
        const web3 = new web3_1.default(machine.provider);
        const accounts = await util_1.default.promisify(web3.eth.getAccounts)();
        if (!machine.fs.exists(machine.paths.root)) {
            machine.fs.mkdir(machine.paths.root);
        }
        if (!machine.fs.exists(machine.paths.tracks)) {
            machine.fs.mkdir(machine.paths.tracks);
        }
        machine.abstraction.defaults({ from: accounts[0] });
        const event = machine.contract.TokenGranted({}, { fromBlock: 'latest', toBlock: 'latest' });
        event.watch((err, result) => {
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
        return machine;
    }
    constructor({ ipfs = DEFAULTS.IPFS, ethereum = DEFAULTS.ETHEREUM, mnemonic = DEFAULTS.MNEMONIC, address = DEFAULTS.ADDRESS, devices = DEFAULTS.DEVICES, } = {}) {
        // IPFS
        const url = url_parse_1.default(ipfs);
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
            this.cash.on('ready', () => this.log.info('[cash][ready]'));
            this.printer.on('ready', () => this.log.info('[printer][ready]'));
            this.lcd.on('ready', () => {
                this.log.info('[lcd][ready]');
                this.lcd.write('Welcome chaos', (err) => {
                    this.log.error(err.toString());
                });
            });
            process.on('SIGINT', () => process.exit(0));
            process.on('uncaughtException', (err) => {
                this.log.error(err.toString());
                setTimeout(() => {
                    process.exit(1);
                }, 500);
            });
            process.on('exit', () => {
                this.cash.close();
                this.printer.close();
                this.lcd.close();
                this.fans.close();
                this.resistor.close();
            });
        }
    }
}
exports.default = Machine;
