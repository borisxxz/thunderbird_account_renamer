"use strict";

const STRINGS = {
  "en": {
    accountLabel: "Account name",
    folderLabel: "Folder name",
    save: "Save",
    cancel: "Cancel",
    emptyError: "Name must not be empty.",
    folderRenameError: "System folders cannot be renamed.",
  },
  "zh-CN": {
    accountLabel: "账户名称",
    folderLabel: "文件夹名称",
    save: "保存",
    cancel: "取消",
    emptyError: "名称不能为空。",
    folderRenameError: "系统文件夹无法重命名。",
  }
};
const lang = (navigator.language || "en").startsWith("zh") ? "zh-CN" : "en";
const s = (key) => STRINGS[lang][key] ?? STRINGS.en[key];

const params = new URLSearchParams(location.search);
const kind = params.get("kind");
const ref = params.get("ref");

const input = document.getElementById("name-input");
const errorEl = document.getElementById("error");
const saveBtn = document.getElementById("save");
const cancelBtn = document.getElementById("cancel");

document.getElementById("label").textContent = kind === "folder" ? s("folderLabel") : s("accountLabel");
saveBtn.textContent = s("save");
cancelBtn.textContent = s("cancel");

(async () => {
  try {
    if (kind === "folder") {
      const folder = await messenger.folders.get(ref);
      input.value = folder.name || "";
    } else {
      const account = await messenger.accounts.get(ref, false);
      input.value = account.name || "";
    }
  } catch (error) {
    errorEl.textContent = String(error.message || error);
  }
  input.focus();
  input.select();
})();

async function save() {
  const value = input.value.trim();
  errorEl.textContent = "";
  if (!value) {
    errorEl.textContent = s("emptyError");
    return;
  }
  saveBtn.disabled = true;
  try {
    if (kind === "folder") {
      await messenger.folders.rename(ref, value);
    } else {
      await messenger.AccountManager.renameAccount(ref, value);
    }
    window.close();
  } catch (error) {
    const message = String(error.message || error);
    if (kind === "folder" && /cannot|unable|not allowed/i.test(message)) {
      errorEl.textContent = s("folderRenameError") + " (" + message + ")";
    } else {
      errorEl.textContent = message;
    }
    saveBtn.disabled = false;
  }
}

saveBtn.addEventListener("click", save);
cancelBtn.addEventListener("click", () => window.close());
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") save();
  if (e.key === "Escape") window.close();
});
