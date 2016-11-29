const morgan = require('koa-morgan');
const FileStreamRotator = require('file-stream-rotator');
const path = require('path');
const logDirectory = path.join(__dirname,'..','..','log');
const fs = require('fs')
let accessLogStream;
if(process.env.NODE_ENV === 'production') {
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	accessLogStream = FileStreamRotator.getStream({
	  date_format: 'YYYYMMDD',
	  filename: logDirectory + `/access-%DATE%-${process.pid}.log`,
	  frequency: 'daily',
	  verbose: false
	})
}


module.exports = () => morgan('combined',{stream: process.env.NODE_ENV === 'production'? accessLogStream : process.stdout});