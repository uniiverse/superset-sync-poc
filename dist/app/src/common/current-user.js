function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import Config from "../config/index.js";
export var CurrentUser = function CurrentUser(context) {
    "use strict";
    _class_call_check(this, CurrentUser);
    _define_property(this, "id", void 0);
    _define_property(this, "firstName", void 0);
    _define_property(this, "lastName", void 0);
    _define_property(this, "email", void 0);
    this.id = context.metadata.get("x-user-id");
    // Don't require headers to be set in development, and default to the DEV_USER_ID.
    if (!this.id && Config.IS_DEV) {
        this.id = Config.DEV_USER_ID;
    }
    if (!this.id) {
    // TODO: Re-enable this check once Oathkeeper production setup is complete.
    // throw new ServerError(
    //   Status.UNAUTHENTICATED,
    //   "Missing X-User-ID metadata."
    // );
    }
    this.firstName = context.metadata.get("x-first-name");
    this.lastName = context.metadata.get("x-last-name");
    this.email = context.metadata.get("x-email");
};
