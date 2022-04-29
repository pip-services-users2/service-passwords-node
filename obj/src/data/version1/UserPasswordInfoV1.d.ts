import { IStringIdentifiable } from 'pip-services3-commons-nodex';
export declare class UserPasswordInfoV1 implements IStringIdentifiable {
    id: string;
    change_time: Date;
    locked: boolean;
    lock_time: Date;
}
