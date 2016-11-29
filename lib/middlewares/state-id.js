const uuid = require('uuid');

module.exports = options => async (ctx, next) => {
	ctx.state.id = uuid(); 
	await next();
	delete ctx.state.id;
}