const assert = require('chai').assert;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { UserPasswordV1 } from '../../../src/data/version1/UserPasswordV1';
import { PasswordsMemoryPersistence } from '../../../src/persistence/PasswordsMemoryPersistence';
import { PasswordsController } from '../../../src/logic/PasswordsController';
import { PasswordsGrpcServiceV1 } from '../../../src/services/version1/PasswordsGrpcServiceV1';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let USER_PWD = new UserPasswordV1('1', 'password123');

suite('PasswordsGrpcServiceV1', ()=> {
    let service: PasswordsGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let persistence = new PasswordsMemoryPersistence();
        let controller = new PasswordsController();

        service = new PasswordsGrpcServiceV1();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-passwords', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-passwords', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-passwords', 'service', 'grpc', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let packageDefinition = protoLoader.loadSync(
            __dirname + "../../../../../src/protos/passwords_v1.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).passwords_v1.Passwords;

        client = new clientProto('localhost:3000', grpc.credentials.createInsecure());
    });

    test('Basic Operations', async () => {

        // Create password
        await new Promise<any>((resolve, reject) => {
            client.set_password(
                {
                    user_id: USER_PWD.id,
                    password: USER_PWD.password
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response);
                }
            );
        });

        // Authenticate user
        let authenticated = await new Promise<any>((resolve, reject) => {
            client.authenticate(
                {
                    user_id: USER_PWD.id,
                    password: USER_PWD.password
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.authenticated);
                }
            );
        });

        assert.isTrue(authenticated);

        // ChangePassword
        await new Promise<any>((resolve, reject) => {
            client.change_password(
                {
                    user_id: USER_PWD.id,
                    old_password: USER_PWD.password,
                    new_password: 'newpwd123'
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.authenticated);
                }
            );
        });

        // Delete password
        await new Promise<any>((resolve, reject) => {
            client.delete_password(
                {
                    user_id: USER_PWD.id
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.authenticated);
                }
            );
        });
        
        // Authenticate user again
        let err = await new Promise<any>((resolve, reject) => {
            client.authenticate(
                {
                    user_id: USER_PWD.id,
                    password: 'newpwd123'
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response.error);
                }
            );
        });

        assert.isNotNull(err);
    });

});
