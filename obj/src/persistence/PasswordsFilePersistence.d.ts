import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';
import { PasswordsMemoryPersistence } from './PasswordsMemoryPersistence';
import { UserPasswordV1 } from '../data/version1/UserPasswordV1';
export declare class PasswordsFilePersistence extends PasswordsMemoryPersistence {
    protected _persister: JsonFilePersister<UserPasswordV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
