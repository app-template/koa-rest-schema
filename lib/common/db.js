const _ = require('underscore');
module.exports = {
	users: [{id: '100', name:'peter', passwd:'1234'}, {id:'101', name: 'foo', passwd:'1234'}, {id:'102', name: 'bar', passwd:'1234'}],
	addUser(user) {
		this.users.push(user);
	},
	findUser(id) {
		return _(this.users).find({id});
	},
	removeUser(id) {
		const index = _(this.users).findIndex(u => u.id === id);
		this.users.splice(index,1);
	}
};
