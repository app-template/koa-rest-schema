const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const _ = require('underscore');
const validate = require('./validator');
const jsf = require('json-schema-faker');
const debug = require('debug')('rest');
const ejs = require('ejs');
const template = ejs.compile(fs.readFileSync(path.join(__dirname, 'rest.tmpl.html')).toString());
const util = require('util');

class Rest {
	constructor({prefix, location}) {
		this.root = prefix || '/';
		this.location = location || path.join(__dirname,'..','resources');
		this.schemas = {};
		this.rests = {};
		this.api = {};


		this.root = Router({prefix});
		fs.readdirSync(this.location).forEach(filename => {
			const [name, type, ext] = filename.split('.');
			if(type === 'schm') {
				debug(`schema file ${filename} is loaded.`);
				this.schemas[name] =  require(path.join(this.location, filename));
			} else if(type === 'rs') {
				debug(`resource file ${filename} is loaded.`);
				this.rests[name] = require(path.join(this.location, filename));
			}
		});
	}

	routes() {
		_.forEach(this.schemas, (schema, name) => {
			const router = new Router();
			this.api[name] = Object.assign({},schema);

			debug(`set up rest endpoint: ${name}`)
			_.forEach(schema, (mount, fnName) => {
				const rs = this.rests[name];
				if(rs && rs.prototype[fnName] && typeof rs.prototype[fnName] === 'function') {
					debug(`${name}.${fnName} has been implemented.`);
					this.api[name][fnName].mock = false;
					router[mount.method](mount.path, validate(mount), async(ctx, next) => {
						const resource = new this.rests[name](ctx.state);
						const result = await resource[fnName](ctx, next);
						if(!ctx.headerSent) {
							ctx.body = result;
						}
						if(resource.cleanup && typeof resource.cleanup === 'function') {
							resource.cleanup();
						}
					});
				} else {
					debug(`${name}.${fnName} is still mocked`);
					this.api[name][fnName].mock = true;
					router[mount.method](mount.path, validate(mount), async (ctx, next) => {
						if(mount.result) {
							ctx.body = jsf(mount.result);
						} else {
							ctx.body = undefined;
						}
					});					
				}

			});
			this.root.use(`/${name}`, router.routes(), router.allowedMethods());
		});
		debug(this.api);
		if( process.env.NODE_ENV !== 'production') {
			this.root.get('/', ctx => ctx.body = template({api:this.api, util}));	
		}
		return async (ctx, next) => {
			await this.root.routes()(ctx, next);
		}
	}
}

if(module === require.main) {
	new Rest({});
}


module.exports = Rest