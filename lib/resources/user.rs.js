const service = require('../common/svc-decorator');

class UserResource {
    constructor(context = {}) {
        this.context = context;
    }

    async create() {
        return {username:'test'};
    }
}


module.exports = service(UserResource);