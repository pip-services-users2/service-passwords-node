import { ILogger } from 'pip-services3-components-nodex';
import { IActivitiesClientV1 } from 'client-activities-node';
export declare class ActivitiesConnector {
    private _logger;
    private _activitiesClient;
    constructor(_logger: ILogger, _activitiesClient: IActivitiesClientV1);
    private logActivity;
    logSigninActivity(correlationId: string, userId: string): Promise<void>;
    logPasswordRecoveredActivity(correlationId: string, userId: string): Promise<void>;
    logPasswordChangedActivity(correlationId: string, userId: string): Promise<void>;
}
