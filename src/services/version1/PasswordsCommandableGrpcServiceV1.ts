import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableGrpcService } from 'pip-services3-grpc-nodex';

export class PasswordsCommandableGrpcServiceV1 extends CommandableGrpcService {
    public constructor() {
        super('v1/passwords');
        this._dependencyResolver.put('controller', new Descriptor('service-passwords', 'controller', 'default', '*', '1.0'));
    }
}