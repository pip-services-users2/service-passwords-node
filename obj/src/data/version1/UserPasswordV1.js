"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPasswordV1 = void 0;
class UserPasswordV1 {
    constructor(id, password) {
        this.id = id;
        this.password = password;
        this.locked = false;
        this.fail_count = 0;
    }
}
exports.UserPasswordV1 = UserPasswordV1;
//# sourceMappingURL=UserPasswordV1.js.map