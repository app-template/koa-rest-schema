const uuid = require('uuid');
const db = require('../common/db');
const service = require('../common/svc-decorator');

class UserService {
    constructor(context = {}) {
        this.context = context;
        this.logger = context.logger;
    }
    
    async findAll(){
        this.logger.info('very good','this is service log');
        return db.users;
    }
    
    async findById(id){
        return db.findUser(id);
    }
    
    async create(user) {
        user.id = uuid.v1();
        db.addUser(user);
        return user;
    }
    
    async update(user) {
        const dbUser = db.findUser(user.id);
        if(dbUser) {
            Object.assign(dbUser, user);
            return dbUser;
        }
    }
    
    async remove(id) {
        const dbUser = db.findUser(id);
        if(dbUser) {
            db.removeUser(dbUser.id);
            return dbUser;
        }
    }
    static foo() {
        
    }
}


module.exports = service(UserService);