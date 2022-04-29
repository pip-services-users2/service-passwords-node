import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableLambdaFunction } from 'pip-services3-aws-nodex';
import { PasswordsServiceFactory } from '../build/PasswordsServiceFactory';

export class PasswordsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("passwords", "User passwords function");
        this._dependencyResolver.put('controller', new Descriptor('service-passwords', 'controller', 'default', '*', '*'));
        this._factories.add(new PasswordsServiceFactory());
    }
}

export const handler = new PasswordsLambdaFunction().getHandler();