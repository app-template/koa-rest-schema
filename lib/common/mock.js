const Router = require('koa-router');
const jsf = require('json-schema-faker');
const validate = require('../middlewares/validator');
const _ = require('underscore');

module.exports = api => (path, schema) => {
	const router = new Router();
	_.forEach(schema, mount => {
		const existing = _.find(api.stack, pathObj => {
			return pathObj.path ===  `${api.opts.prefix}${path}${mount.path}` && pathObj.methods.includes(mount.method.toUpperCase());
		});
		if(existing) return;
		router[mount.method](mount.path, validate(mount), async (ctx, next) => {
			if(mount.result) {
				ctx.body = jsf(mount.result);
			} else {
				ctx.body = undefined;
			}
		})
	});
	api.use(path, router.routes(), router.allowedMethods());
}