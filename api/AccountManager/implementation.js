"use strict";

// Experiment API: the WebExtension accounts API is read-only, so account
// display names can only be changed through Thunderbird's internals.
var AccountManager = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    const { ExtensionError } = ExtensionCommon;

    function loadMailServices() {
      try {
        return ChromeUtils.importESModule("resource:///modules/MailServices.sys.mjs").MailServices;
      } catch {
        return ChromeUtils.import("resource:///modules/MailServices.jsm").MailServices;
      }
    }

    return {
      AccountManager: {
        async renameAccount(accountId, name) {
          const trimmed = String(name || "").trim();
          if (!trimmed) {
            throw new ExtensionError("Account name must not be empty.");
          }
          const MailServices = loadMailServices();
          const account = MailServices.accounts.getAccountById(accountId);
          if (!account) {
            throw new ExtensionError(`Account not found: ${accountId}`);
          }
          account.name = trimmed;
        },
      },
    };
  }
};
