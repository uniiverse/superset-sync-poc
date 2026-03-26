import { CallContext } from "nice-grpc";

import Config from "../config/index.js";

export class CurrentUser {
  id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;

  // Initialize the current user from gRPC metadata.
  constructor(context: CallContext) {
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
  }
}
