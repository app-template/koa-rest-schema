const etag = require('koa-etag')();

module.exports = () => async (ctx, next) => {
    await etag(ctx, next);
    if(ctx.header['if-none-match'] === ctx.response.header['etag'] && (ctx.status / 100 | 0) === 2) {
        ctx.status = 304;
    }
}

