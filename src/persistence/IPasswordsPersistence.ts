import { IGetter } from 'pip-services3-data-nodex';
import { IWriter } from 'pip-services3-data-nodex';
import { UserPasswordV1 } from '../data/version1/UserPasswordV1';

export interface IPasswordsPersistence 
    extends IGetter<UserPasswordV1, string>, IWriter<UserPasswordV1, string> {

    getOneById(correlationId: string, userId: string): Promise<UserPasswordV1>;

    create(correlationId: string, item: UserPasswordV1): Promise<UserPasswordV1>;

    update(correlationId: string, item: UserPasswordV1): Promise<UserPasswordV1>;

    deleteById(correlationId: string, id: string): Promise<UserPasswordV1>;
}
