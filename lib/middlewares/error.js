module.exports = options => async (ctx, next) => {
    try {
        await next();    
    } catch (e) {
        ctx.state.logger.error(e);
        ctx.status = e.status || 500;
        ctx.body = {
            message: ctx.status < 500 || e.expose ? e.message : ctx.state.id,
            properties : Object.assign({},e)
        };
    }
}