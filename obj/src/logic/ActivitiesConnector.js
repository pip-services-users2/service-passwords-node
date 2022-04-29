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
exports.ActivitiesConnector = void 0;
const client_activities_node_1 = require("client-activities-node");
const client_activities_node_2 = require("client-activities-node");
const PasswordActivityTypeV1_1 = require("../data/version1/PasswordActivityTypeV1");
class ActivitiesConnector {
    constructor(_logger, _activitiesClient) {
        this._logger = _logger;
        this._activitiesClient = _activitiesClient;
        if (_activitiesClient == null)
            this._logger.warn(null, 'Activities client was not found. Logging password activities is disabled');
    }
    logActivity(correlationId, userId, activityType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._activitiesClient == null)
                return;
            let party = new client_activities_node_2.ReferenceV1(userId, 'account', null);
            let activity = new client_activities_node_1.PartyActivityV1(null, activityType, party);
            try {
                yield this._activitiesClient.logPartyActivity(correlationId, activity);
            }
            catch (err) {
                this._logger.error(correlationId, err, 'Failed to log user activity');
            }
        });
    }
    logSigninActivity(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logActivity(correlationId, userId, PasswordActivityTypeV1_1.PasswordActivityTypeV1.Signin);
        });
    }
    logPasswordRecoveredActivity(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logActivity(correlationId, userId, PasswordActivityTypeV1_1.PasswordActivityTypeV1.PasswordRecovered);
        });
    }
    logPasswordChangedActivity(correlationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logActivity(correlationId, userId, PasswordActivityTypeV1_1.PasswordActivityTypeV1.PasswordChanged);
        });
    }
}
exports.ActivitiesConnector = ActivitiesConnector;
//# sourceMappingURL=ActivitiesConnector.js.map