const assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';
import { ConsoleLogger } from 'pip-services3-components-nodex';

import { MessageDistributionNullClientV1 } from 'client-msgdistribution-node';

import { UserPasswordV1 } from '../../src/data/version1/UserPasswordV1';
import { PasswordsMemoryPersistence } from '../../src/persistence/PasswordsMemoryPersistence';
import { PasswordsController } from '../../src/logic/PasswordsController';

let USER_PWD = new UserPasswordV1('1', 'password123');

suite('PasswordsController', ()=> {    
    let persistence: PasswordsMemoryPersistence;
    let controller: PasswordsController;

    suiteSetup(() => {
        persistence = new PasswordsMemoryPersistence();
        controller = new PasswordsController();
        controller.configure(new ConfigParams());

        let logger = new ConsoleLogger();

        let references: References = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('service-passwords', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-passwords', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-msgdistribution', 'client', 'null', 'default', '1.0'), new MessageDistributionNullClientV1()
        );

        controller.setReferences(references);
    });
    
    setup(async () => {
        await persistence.clear(null);
    });
    
    test('Recover Password', async () => {
        let userPassword1: UserPasswordV1;
        // Create a new user
        await controller.setPassword(
            null,
            USER_PWD.id,
            USER_PWD.password
        );

        // Verify
        let userPassword = await persistence.getOneById(null, USER_PWD.id);

        assert.equal(USER_PWD.id, userPassword.id);
        assert.isNull(userPassword.rec_code || null);

        // Recover password
        await controller.recoverPassword(null, USER_PWD.id);
        
        // Verify
        userPassword = await persistence.getOneById(null, USER_PWD.id);

        assert.equal(USER_PWD.id, userPassword.id);
        assert.isNotNull(userPassword.rec_code);
        assert.equal(userPassword.rec_code.length, 9);
        assert.isNotNull(userPassword.rec_expire_time);

        userPassword1 = userPassword;

        // Validate code
        let valid = await controller.validateCode(null, USER_PWD.id, userPassword1.rec_code);

        assert.isTrue(valid);
    });

    test('Recover Code Length', async () => {
        let userPassword1: UserPasswordV1;
        controller.configure(ConfigParams.fromTuples("options.code_length","4"));

        // Create a new user
        await controller.setPassword(null, USER_PWD.id, USER_PWD.password);

        // Verify
        let userPassword = await persistence.getOneById(null, USER_PWD.id);

        assert.equal(USER_PWD.id, userPassword.id);
        assert.isNull(userPassword.rec_code || null);

        // Recover password
        await controller.recoverPassword(null, USER_PWD.id);

        // Verify
        userPassword1 = await persistence.getOneById(null, USER_PWD.id);

        assert.equal(USER_PWD.id, userPassword.id);
        assert.isNotNull(userPassword.rec_code);
        assert.equal(userPassword.rec_code.length, 4);
        assert.isNotNull(userPassword.rec_expire_time);

        // Validate code
        let valid = await controller.validateCode(null, USER_PWD.id, userPassword1.rec_code);

        assert.isTrue(valid);
    });

    test('Change Password', async () => {

        // Sign up
        await controller.setPassword(null, USER_PWD.id, USER_PWD.password);

        // Change password
        await controller.changePassword(null, USER_PWD.id, USER_PWD.password, 'xxx123');

        // Sign in with new password
        let authenticated = await controller.authenticate(null, USER_PWD.id, 'xxx123');

        assert.isTrue(authenticated);
    });

    test('Fail to Signin with Wrong Password', async () => {
        
        // Sign up
        await controller.setPassword(null, USER_PWD.id, USER_PWD.password);

        // Sign in with wrong password
        let err: Error;
        try {
            let authenticated = await controller.authenticate(null, USER_PWD.id, 'xxx');
        } catch(e) {
            err = e;
        }
        
        assert.isNotNull(err);
    });

    test('Set Temp Password', async () => {
        // Create a new user
        let password = await controller.setTempPassword(null, USER_PWD.id);

        assert.isNotNull(password);

        // Verify
        let info = await controller.getPasswordInfo(null, USER_PWD.id);

        assert.equal(USER_PWD.id, info.id);
        assert.isNotNull(info.change_time);
    });

});