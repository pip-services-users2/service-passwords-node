const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { UserPasswordV1 } from '../../../src/data/version1/UserPasswordV1';
import { PasswordsMemoryPersistence } from '../../../src/persistence/PasswordsMemoryPersistence';
import { PasswordsController } from '../../../src/logic/PasswordsController';
import { PasswordsHttpServiceV1 } from '../../../src/services/version1/PasswordsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let USER_PWD = new UserPasswordV1('1', 'password123');

suite('PasswordsHttpServiceV1', () => {
    let service: PasswordsHttpServiceV1;

    let rest: any;

    suiteSetup(async () => {
        let persistence = new PasswordsMemoryPersistence();
        let controller = new PasswordsController();

        service = new PasswordsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-passwords', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-passwords', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-passwords', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    test('Basic Operations', async () => {

        // Create password
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/passwords/set_password',
                {
                    user_id: USER_PWD.id,
                    password: USER_PWD.password
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Authenticate user
        let result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/passwords/authenticate',
                {
                    user_id: USER_PWD.id,
                    password: USER_PWD.password
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(result);
        assert.isTrue(result.authenticated);

        // ChangePassword
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/passwords/change_password',
                {
                    user_id: USER_PWD.id,
                    old_password: USER_PWD.password,
                    new_password: 'newpwd123'
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Delete password
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/passwords/delete_password',
                {
                    user_id: USER_PWD.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Authenticate user again
        let err = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/passwords/authenticate',
                {
                    user_id: USER_PWD.id,
                    password: 'newpwd123'
                },
                (err, req, res, result) => {
                    resolve(err);
                }
            );
        });

        assert.isNotNull(err);
    });
    
});