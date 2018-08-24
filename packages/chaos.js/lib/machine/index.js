"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipfs_api_1 = __importDefault(require("ipfs-api"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const truffle_contract_1 = __importDefault(require("truffle-contract"));
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
/* tslint:disable:no-var-requires */
const LCD = os_1.default.type() === 'Linux' ? require('./devices/lcd') : require('./devices/lcd-spoof');
const Relay = os_1.default.type() === 'Linux' ? require('./devices/relay') : require('./devices/relay-spoof');
/* tslint:enable:no-var-requires */
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class Machine {
    constructor({ contract = Machine.defaults.contract, devices = Machine.defaults.devices, ethereum = Machine.defaults.ethereum, ipfs = Machine.defaults.ipfs } = {}) {
        // IPFS
        const url = url_parse_1.default(ipfs);
        this.ipfs = ipfs_api_1.default(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) });
        // web3
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(ethereum));
        // abstraction
        this.abstraction = truffle_contract_1.default(require('@chaosmachine/core/build/contracts/Chaos.json'));
        this.abstraction.setProvider(new web3_1.default.providers.HttpProvider(ethereum));
        // contract
        this.contract = this.abstraction.at(contract);
        // utils
        this.fs = fs_1.default;
        this.paths = {
            log: path_1.default.join(os_1.default.homedir(), '.chaos', 'log'),
            root: path_1.default.join(os_1.default.homedir(), '.chaos'),
            tracks: path_1.default.join(os_1.default.homedir(), '.chaos', 'tracks')
        };
        // components
        this.log = new log_1.default(this);
        this.track = new track_1.default(this);
        this.audio = new audio_1.default(this);
        this.token = new token_1.default(this);
        // devices
        if (devices) {
            try {
                this.cash = new cash_1.default({ port: '/dev/cash' });
                this.printer = new printer_1.default({ port: '/dev/printer' });
                this.lcd = new LCD({ rs: 25, e: 24, data: [23, 17, 27, 22], cols: 16, rows: 2 });
                this.fans = new Relay({ pin: 15 });
                this.resistor = new Relay({ pin: 14 });
                // initialization
                this.fans.turnOn();
                this.cash.on('ready', () => this.log.info('Cash ready'));
                this.printer.on('ready', () => {
                    this.log.info('Printer ready');
                    this.printer.print('https://www.distributedgallery.com');
                });
                this.lcd.on('ready', () => {
                    this.log.info('LCD ready');
                    this.lcd.write('HI, CHAOS');
                });
                // event handling
                this.printer.on('done', (data) => this.log.info('QRCode printed'));
                this.cash.on('accepted', async () => {
                    try {
                        this.log.info('Bill burning');
                        this.cash.ssp.disable();
                        this.resistor.turnOn();
                        this.lcd.write('BURNING BILL');
                        await timeout(20000);
                        this.resistor.turnOff();
                        this.lcd.write('BURNING BILL');
                        await timeout(5000);
                        this.resistor.turnOn();
                        this.lcd.write('BURNING BILL');
                        await timeout(10000);
                        this.resistor.turnOff();
                        this.lcd.write('BURNING BILL');
                        const token = this.token.generate();
                        this.log.info('Generating token', { token: token.address });
                        this.printer.printShort('https://chaos.distributedgallery.com/upload/' + token.privateKey);
                        this.lcd.write('TAKE YOUR TICKET');
                        await timeout(5000);
                        this.lcd.write('WAIT FOR TX MINED');
                        this.log.info('Registering token', { token: token.address });
                        await this.token.register(token.address);
                        this.log.info('Token registered', { token: token.address });
                        this.lcd.write('HI, CHAOS');
                        this.cash.ssp.enable();
                    }
                    catch (err) {
                        this.log.error(err.toString());
                    }
                });
            }
            catch (err) {
                this.log.error(err.toString());
            }
            // exit process nicely
            process.on('SIGINT', () => {
                // this.cash!.close()
                // this.printer!.close()
                // this.lcd!.close()
                // this.fans!.close()
                // this.resistor!.close()
                process.exit(0);
            });
            process.on('uncaughtException', (err) => {
                this.log.error(err.toString());
            });
            process.on('unhandledRejection', (reason, p) => {
                this.log.error(reason);
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
    async start() {
        if (!this.fs.exists(this.paths.root)) {
            this.fs.mkdir(this.paths.root);
        }
        if (!this.fs.exists(this.paths.tracks)) {
            this.fs.mkdir(this.paths.tracks);
        }
        const accounts = await util_1.default.promisify(this.web3.eth.getAccounts)();
        this.address = accounts[0];
        const event = this.contract.TokenGranted({}, { fromBlock: 'latest', toBlock: 'latest' });
        event.watch(async (err, result) => {
            if (err) {
                this.log.error(err);
            }
            else {
                this.log.info('Token granted', { machine: result.args.machine, token: result.args.token });
                await this.audio.shuffle();
            }
        });
    }
}
// defaults parameters
Machine.defaults = {
    contract: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
    devices: false,
    ethereum: 'http://localhost:8545',
    ipfs: 'https://ipfs.infura.io:5001'
};
exports.default = Machine;
