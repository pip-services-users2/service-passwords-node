const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';

import { UserPasswordV1 } from '../../src/data/version1/UserPasswordV1';
import { PasswordsLambdaFunction } from '../../src/container/PasswordsLambdaFunction';

let USER_PWD = new UserPasswordV1('1', 'password123');

suite('PasswordsLambdaFunction', ()=> {
    let lambda: PasswordsLambdaFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'service-passwords:persistence:memory:default:1.0',
            'controller.descriptor', 'service-passwords:controller:default:default:1.0'
        );

        lambda = new PasswordsLambdaFunction();
        lambda.configure(config);
        await lambda.open(null);
    });
    
    suiteTeardown(async () => {
        await lambda.close(null);
    });
    
    test('Basic Operations', async () => {
        
        // Create password
        await lambda.act(
            {
                role: 'passwords',
                cmd: 'set_password',
                user_id: USER_PWD.id,
                password: USER_PWD.password
            }
        );

        // Authenticate user
        let result = await lambda.act(
            {
                role: 'passwords',
                cmd: 'authenticate',
                user_id: USER_PWD.id,
                password: USER_PWD.password
            }
        );

        assert.isObject(result);
        assert.isTrue(result.authenticated);

        // Change password
        await lambda.act(
            {
                role: 'passwords',
                cmd: 'change_password',
                user_id: USER_PWD.id,
                old_password: USER_PWD.password,
                new_password: 'newpwd123'
            }
        );

        // Delete password
        await lambda.act(
            {
                role: 'passwords',
                cmd: 'delete_password',
                user_id: USER_PWD.id
            }
        );

        // Try to authenticate
        let err: Error;

        try {
            await lambda.act(
                {
                    role: 'passwords',
                    cmd: 'authenticate',
                    user_id: USER_PWD.id,
                    password: 'newpwd123'
                }
            );
        } catch(e) {
            err = e;
        }

        assert.isNotNull(err);
    });
    
});