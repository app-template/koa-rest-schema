const Debug = require('debug');

function proxy(f, debug) {
	return new Proxy(f, {
		apply(target, cxt, args) {
		    const context = cxt.context ||{};
		    if(context.timeout) {
		        throw new Error('abort-by-timeout');
		    }
			debug(context.id || '', '<<',...args);
			const r =  target.apply(cxt, args);
			debug(context.id || '', '>>', r);
			return r;
		}
	});
}

module.exports = (fn) => {
    const className = fn.name;
    Object.getOwnPropertyNames(fn.prototype).filter(name => name !== 'constructor' && typeof fn.prototype[name] === 'function').forEach(name => {
	    let debug = process.env.NODE_ENV === 'production'? ()=>{} : Debug(`${className}:${name}`);
        fn.prototype[name] = proxy(fn.prototype[name], debug);
    });
    Object.getOwnPropertyNames(fn).filter(name => name !== 'constructor' && typeof fn[name] === 'function').forEach(name => {
	    let debug = process.env.NODE_ENV === 'production'? ()=>{} : Debug(`${className}:${name}`);
        fn[name] = proxy(fn[name], debug);
    });
    return fn;
}