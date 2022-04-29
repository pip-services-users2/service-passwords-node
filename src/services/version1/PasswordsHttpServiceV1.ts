import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class PasswordsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/passwords');
        this._dependencyResolver.put('controller', new Descriptor('service-passwords', 'controller', 'default', '*', '1.0'));
    }
}