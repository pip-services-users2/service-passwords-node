import { ProcessContainer } from 'pip-services3-container-nodex';

import { PasswordsServiceFactory } from '../build/PasswordsServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultGrpcFactory } from 'pip-services3-grpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

export class PasswordsProcess extends ProcessContainer {

    public constructor() {
        super("passwords", "User passwords microservice");
        this._factories.add(new PasswordsServiceFactory());
        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new DefaultGrpcFactory());
        this._factories.add(new DefaultSwaggerFactory());
    }

}
