import { ILogger } from 'pip-services3-components-nodex';
import { MessageResolverV1 } from 'client-msgdistribution-node';
import { IMessageDistributionClientV1 } from 'client-msgdistribution-node';
export declare class MessageConnector {
    private _logger;
    private _messageResolver;
    private _messageDistributionClient;
    constructor(_logger: ILogger, _messageResolver: MessageResolverV1, _messageDistributionClient: IMessageDistributionClientV1);
    private sendMessage;
    sendAccountLockedEmail(correlationId: string, userId: string): Promise<void>;
    sendPasswordChangedEmail(correlationId: string, userId: string): Promise<void>;
    sendRecoverPasswordEmail(correlationId: string, userId: string, code: string): Promise<void>;
}
