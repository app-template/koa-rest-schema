const winston = require('winston');
const path = require('path');
const logDirectory = path.join(__dirname,'..','..','log');
const LOG_LEVEL = 'info';
const LOG_NAME = 'app-' + process.pid;

const fs = require('fs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);


const consoleTransports = new (winston.transports.Console)({
	colorize: true,
	level: LOG_LEVEL
});

const fileTransports = new (winston.transports.File)({
	filename: path.join(logDirectory, LOG_NAME + '.log'),
	level: LOG_LEVEL,
	maxsize: 10240000,
	maxFiles: 5,
	tailable: true,
	json: false
});

winston.configure({transports: [process.env.NODE_ENV === 'production'? fileTransports : consoleTransports]});

const logger  = global.logger = {
    info: winston.info.bind(winston),
    warn: winston.warn.bind(winston),
    error: winston.error.bind(winston)
}

module.exports = options => async (ctx, next) => {
    const ctxlogger = {};
    ['info', 'warn', 'error'].forEach(level => {
       ctxlogger[level] = (...args) => {
           logger[level](ctx.state.id, ...args);
       }
    });
    ctx.state.logger = ctxlogger;
    await next();
    delete ctx.state.logger;
}