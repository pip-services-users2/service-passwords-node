const assert = require('chai').assert;

import { IPasswordsPersistence } from '../../src/persistence/IPasswordsPersistence';
import { UserPasswordV1 } from '../../src/data/version1/UserPasswordV1';

let USER_PWD = new UserPasswordV1('1', 'password123');

export class PasswordsPersistenceFixture {
    private _persistence: IPasswordsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    public async testCrudOperations() {

        // Create user password
        let userPassword = await this._persistence.create(null, USER_PWD);

        assert.isObject(userPassword);
        assert.equal(userPassword.id, USER_PWD.id);
        assert.isNotNull(userPassword.password);
        assert.isFalse(userPassword.locked);

        // Update the user password
        userPassword = new UserPasswordV1(USER_PWD.id, 'newpwd123');
        userPassword.rec_code = "123";
        userPassword.rec_expire_time = new Date();

        userPassword = await this._persistence.update(null, userPassword);
        
        assert.isObject(userPassword);
        assert.equal(userPassword.id, USER_PWD.id)
        assert.equal(userPassword.password, 'newpwd123');

        // Get user password
        userPassword = await this._persistence.getOneById(null, USER_PWD.id);

        assert.isObject(userPassword);
        assert.equal(userPassword.id, USER_PWD.id);

        // Delete the user password
        await this._persistence.deleteById(null, USER_PWD.id);
        
        // Try to get delete user
        userPassword = await this._persistence.getOneById(null, USER_PWD.id);

        assert.isNull(userPassword || null);
    }

}
