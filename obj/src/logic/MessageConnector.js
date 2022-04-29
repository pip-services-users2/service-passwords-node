"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConnector = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const client_msgdistribution_node_1 = require("client-msgdistribution-node");
class MessageConnector {
    constructor(_logger, _messageResolver, _messageDistributionClient) {
        this._logger = _logger;
        this._messageResolver = _messageResolver;
        this._messageDistributionClient = _messageDistributionClient;
        if (_messageDistributionClient == null)
            this._logger.warn(null, 'Message distribution client was not found. Password notifications are disabled');
    }
    sendMessage(correlationId, userId, message, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._messageDistributionClient == null)
                return;
            if (message == null)
                return;
            try {
                yield this._messageDistributionClient.sendMessageToRecipient(correlationId, userId, null, message, parameters, client_msgdistribution_node_1.DeliveryMethodV1.All);
            }
            catch (err) {
                this._logger.error(correlationId, err, 'Failed to send message');
            }
        });
    }
    sendAccountLockedEmail(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = this._messageResolver.resolve("account_locked");
            yield this.sendMessage(correlationId, userId, message, null);
        });
    }
    sendPasswordChangedEmail(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = this._messageResolver.resolve("password_changed");
            yield this.sendMessage(correlationId, userId, message, null);
        });
    }
    sendRecoverPasswordEmail(correlationId, userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = this._messageResolver.resolve("recover_password");
            let parameters = pip_services3_commons_nodex_1.ConfigParams.fromTuples("code", code);
            yield this.sendMessage(correlationId, userId, message, parameters);
        });
    }
}
exports.MessageConnector = MessageConnector;
//# sourceMappingURL=MessageConnector.js.map