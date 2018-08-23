"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
class Track {
    constructor(machine) {
        this.machine = machine;
    }
    path(hash) {
        return path_1.default.join(this.machine.paths.tracks, hash);
    }
    exists(hash) {
        return this.machine.fs.exists(path_1.default.join(this.machine.paths.tracks, hash));
    }
    async download(hash) {
        this.machine.log.info('Downloading', { hash });
        const buffer = await this.machine.ipfs.files.cat(hash);
        this.machine.fs.write(this.path(hash), buffer);
        this.machine.log.info('Downloaded', { hash });
    }
}
exports.default = Track;
