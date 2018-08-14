import EventEmitter from 'events'


export default class LCDSpoof extends EventEmitter {

	constructor(opts?) {
		super()
	}

	public write(text, cb) {}

	public close() {}
}
