"use strict";

// ---------- i18n ----------
const MESSAGES = {
  "en": {
    menuRenameAccount: "Rename account (F2)",
    menuRenameFolder: "Rename folder",
    menuCopyAddress: "Copy email address",
    notifyCopied: "Copied: {address}",
    notifyNoAddress: "This account has no email address.",
    notifyNoSelection: "Select an account in the folder pane first.",
    notifyRenamed: "Renamed to \"{name}\".",
  },
  "zh-CN": {
    menuRenameAccount: "重命名账户（F2）",
    menuRenameFolder: "重命名文件夹",
    menuCopyAddress: "复制邮箱地址",
    notifyCopied: "已复制：{address}",
    notifyNoAddress: "该账户没有邮箱地址。",
    notifyNoSelection: "请先在左侧文件夹面板选中一个账户。",
    notifyRenamed: "已重命名为“{name}”。",
  }
};

const lang = (navigator.language || "en").startsWith("zh") ? "zh-CN" : "en";
function t(key, params) {
  let text = MESSAGES[lang][key] ?? MESSAGES.en[key] ?? key;
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

function notify(message) {
  messenger.notifications.create({
    type: "basic",
    title: "Account F2 Renamer",
    message,
    iconUrl: messenger.runtime.getURL("icons/icon-48.png")
  });
}

// ---------- rename window ----------
let renameWindowId = null;

async function openRenameWindow(kind, ref) {
  if (renameWindowId !== null) {
    try {
      await messenger.windows.update(renameWindowId, { focused: true });
      return;
    } catch {
      renameWindowId = null;
    }
  }
  const url = messenger.runtime.getURL(`rename.html?kind=${kind}&ref=${encodeURIComponent(ref)}`);
  const win = await messenger.windows.create({ type: "popup", url, width: 380, height: 200 });
  renameWindowId = win.id;
}

messenger.windows.onRemoved.addListener((windowId) => {
  if (windowId === renameWindowId) renameWindowId = null;
});

// ---------- F2 shortcut ----------
// The folder pane does not expose its selection, so the F2 target is the
// account of the currently displayed folder of the active mail tab.
messenger.commands.onCommand.addListener(async (command) => {
  if (command !== "rename-account") return;
  try {
    const tabs = await messenger.mailTabs.query({ active: true, currentWindow: true });
    const folder = tabs.length && tabs[0].displayedFolder;
    if (!folder) {
      notify(t("notifyNoSelection"));
      return;
    }
    await openRenameWindow("account", folder.accountId);
  } catch (error) {
    notify(String(error.message || error));
  }
});

// ---------- context menu ----------
function rebuildMenus() {
  messenger.menus.removeAll();
  messenger.menus.create({ id: "rename-account", title: t("menuRenameAccount"), contexts: ["folder_pane"] });
  messenger.menus.create({ id: "rename-folder", title: t("menuRenameFolder"), contexts: ["folder_pane"] });
  messenger.menus.create({ id: "copy-address", title: t("menuCopyAddress"), contexts: ["folder_pane"] });
}

const isRootFolder = (folder) => !folder || folder.type === "root" || folder.path === "/";

messenger.menus.onShown.addListener(async (info) => {
  const folder = info.folders && info.folders[0];
  await messenger.menus.update("rename-folder", { visible: !isRootFolder(folder) });
  await messenger.menus.refresh();
});

messenger.menus.onClicked.addListener(async (info) => {
  const folder = (info.folders && info.folders[0]) || (info.selectedFolders && info.selectedFolders[0]);
  if (!folder) return;

  if (info.menuItemId === "rename-account") {
    await openRenameWindow("account", folder.accountId);
    return;
  }
  if (info.menuItemId === "rename-folder") {
    if (!isRootFolder(folder)) await openRenameWindow("folder", folder.id);
    return;
  }
  if (info.menuItemId === "copy-address") {
    try {
      const account = await messenger.accounts.get(folder.accountId, false);
      const address = (account.identities && account.identities[0] && account.identities[0].email) || "";
      if (!address) {
        notify(t("notifyNoAddress"));
        return;
      }
      await navigator.clipboard.writeText(address);
      notify(t("notifyCopied", { address }));
    } catch (error) {
      notify(String(error.message || error));
    }
  }
});

rebuildMenus();
