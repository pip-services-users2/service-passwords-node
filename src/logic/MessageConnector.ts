import { ILogger } from 'pip-services3-components-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';

import { MessageV1 } from 'client-msgdistribution-node';
import { DeliveryMethodV1 } from 'client-msgdistribution-node';
import { MessageResolverV1 } from 'client-msgdistribution-node';
import { IMessageDistributionClientV1 } from 'client-msgdistribution-node';

export class MessageConnector {
    public constructor(
        private _logger: ILogger,
        private _messageResolver: MessageResolverV1,
        private _messageDistributionClient: IMessageDistributionClientV1
    ) {
        if (_messageDistributionClient == null)
            this._logger.warn(null, 'Message distribution client was not found. Password notifications are disabled');
    }

    private async sendMessage(correlationId: string, userId: string, message: MessageV1, parameters: ConfigParams): Promise<void> {
        if (this._messageDistributionClient == null) return;
        if (message == null) return;

        try {
            await this._messageDistributionClient.sendMessageToRecipient(
                correlationId, userId, null, message, parameters, DeliveryMethodV1.All
            );
        } catch(err) {
            this._logger.error(correlationId, err, 'Failed to send message');
        }
    }

    public async sendAccountLockedEmail(correlationId: string, userId: string): Promise<void> {
        let message = this._messageResolver.resolve("account_locked");
        await this.sendMessage(correlationId, userId, message, null);
    }

    public async sendPasswordChangedEmail(correlationId: string, userId: string): Promise<void> {
        let message = this._messageResolver.resolve("password_changed");
        await this.sendMessage(correlationId, userId, message, null);
    }

    public async sendRecoverPasswordEmail(correlationId: string, userId: string, code: string): Promise<void> {
        let message = this._messageResolver.resolve("recover_password");
        let parameters = ConfigParams.fromTuples("code", code);
        await this.sendMessage(correlationId, userId, message, parameters);
    }

}