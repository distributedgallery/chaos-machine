"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sound_player_1 = __importDefault(require("sound-player"));
class Audio {
    constructor(machine) {
        this.machine = machine;
        this.player = new sound_player_1.default({ player: 'mpg123', filename: '' });
    }
    async shuffle() {
        const hash = await this.machine.contract.shuffle();
        this.machine.log.info('Shuffling', { track: hash });
        this.play(hash);
        return hash;
    }
    async play(hash) {
        if (!this.machine.track.exists(hash)) {
            await this.machine.track.download(hash);
        }
        if (this.player.process) {
            process.kill(this.player.process.pid);
        }
        this.machine.log.info('Playing', { track: hash });
        this.player.play({ player: 'mpg123', filename: this.machine.track.path(hash) });
    }
}
exports.default = Audio;
