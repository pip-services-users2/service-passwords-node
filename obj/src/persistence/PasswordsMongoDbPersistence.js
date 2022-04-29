"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordsMongoDbPersistence = void 0;
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class PasswordsMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('passwords');
    }
}
exports.PasswordsMongoDbPersistence = PasswordsMongoDbPersistence;
//# sourceMappingURL=PasswordsMongoDbPersistence.js.map