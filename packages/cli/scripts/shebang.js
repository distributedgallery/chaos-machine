const fs = require('fs')

const data = fs.readFileSync('./lib/chaos.js')
const fd = fs.openSync('./lib/chaos.js', 'w+')
const buffer = Buffer.from('#!/usr/bin/env node\n')

fs.writeSync(fd, buffer, 0, buffer.length, 0)
fs.writeSync(fd, data, 0, data.length, buffer.length)

fs.closeSync(fd)
