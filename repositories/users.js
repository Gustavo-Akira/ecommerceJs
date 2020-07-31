const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const script = util.promisify(crypto.scrypt);
const Repository = require('./repository');
class UserRepository extends Repository{
    async comparePasswords(saved, supplied){
        const [hashed, salt] = saved.split('.');
        const hashedSupplied = await script(supplied, salt, 64);
        return hashed === hashedSupplied;
    }
    async create(attrs){
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await script(attrs.password, salt, 64);
        const records = await this.getAll();
        const record = {...attrs, password:`${buf.toString('hex')}.${salt}`};
        records.push(record);
        await this.writeAll(records);
        return attrs;
    }
}
module.exports = new UserRepository('users.json');