import { ILogger } from 'pip-services3-components-nodex';

import { IActivitiesClientV1 } from 'client-activities-node';
import { PartyActivityV1 } from 'client-activities-node';
import { ReferenceV1 } from 'client-activities-node';

import { PasswordActivityTypeV1 } from '../data/version1/PasswordActivityTypeV1';

export class ActivitiesConnector {

    public constructor(
        private _logger: ILogger,
        private _activitiesClient: IActivitiesClientV1
    ) {
        if (_activitiesClient == null)
            this._logger.warn(null, 'Activities client was not found. Logging password activities is disabled');
    }

    private async logActivity(correlationId: string, userId: string, activityType: string): Promise<void> {
        if (this._activitiesClient == null) return;

        let party = new ReferenceV1(userId, 'account', null);
        let activity = new PartyActivityV1(null, activityType, party);

        try {
            await this._activitiesClient.logPartyActivity(
                correlationId,
                activity
            );
        } catch (err) {
            this._logger.error(correlationId, err, 'Failed to log user activity');
        }
    }

    public async logSigninActivity(correlationId: string, userId: string): Promise<void> {
        await this.logActivity(correlationId, userId, PasswordActivityTypeV1.Signin);
    }

    public async logPasswordRecoveredActivity(correlationId: string, userId: string): Promise<void> {
        await this.logActivity(correlationId, userId, PasswordActivityTypeV1.PasswordRecovered);
    }

    public async logPasswordChangedActivity(correlationId: string, userId: string): Promise<void> {
        await this.logActivity(correlationId, userId, PasswordActivityTypeV1.PasswordChanged);
    }

}