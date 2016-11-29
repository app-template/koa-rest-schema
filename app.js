const Koa = require('koa');
const app = module.exports = new Koa();
const timeout = require('koa-timeout-v2');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const xTime = require('koa-xtime');
const path = require('path');

const id = require('./lib/middlewares/state-id');
const appLogger = require('./lib/middlewares/app-logger');
const accLogger = require('./lib/middlewares/acc-logger');
const error = require('./lib/middlewares/error');
const etag = require('./lib/middlewares/etag');

const Rest = require('./lib/middlewares/rest');
const rest = new Rest({
	prefix:'/api', 
	resources: path.join(__dirname, './lib/resources')
});

app.proxy = true;
app.use(helmet());
app.use(accLogger());
app.use(id());
app.use(appLogger());
app.use(error());
app.use(xTime());
app.use(bodyParser());
app.use(compress());
app.use(timeout(500));
app.use(etag());
app.use(rest.routes());
app.on('error', err => global.logger.error(err));

if (require.main === module ) {
    app.listen(process.env.PORT || 3000);    
}



