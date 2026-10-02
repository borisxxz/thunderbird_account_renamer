# Account F2 Renamer

English | **[中文](./README.md)**

![Thunderbird](https://img.shields.io/badge/Thunderbird-128%2B-%230F8FF?logo=thunderbird&logoColor=white)
![Version](https://img.shields.io/badge/version-0.0.1-indigo)
![License](https://img.shields.io/badge/license-MIT-green)

> A Thunderbird add-on: press **F2** in the folder pane to rename an account's display name; right-click to rename folders or copy the account's email address.

## Why it exists

Thunderbird's WebExtension API is read-only for account names, so no store add-on can change them. This add-on uses the official Experiment API to reach Thunderbird internals — it only changes the local **Account Name** label shown in the folder pane. It never touches "Your Name" or the email address (those affect outgoing identity).

## Features

| Action | How |
|---|---|
| **Rename account name** | Select any folder of the account, press **F2**; or right-click → Rename account (F2) |
| Rename folder | Right-click a folder → Rename folder (hidden for system folders like Inbox) |
| Copy email address | Right-click any account/folder → Copy email address (clipboard + notification) |

**Enter** saves, **Esc** cancels; rebind the key under Add-ons → Manage Extension Shortcuts.

## Install

Download the zip from [Releases](https://github.com/borisxxz/thunderbird_account_renamer/releases) (or the [CNB mirror](https://cnb.cool/boris007/thunderbird_account_renamer)) → Thunderbird `Tools → Add-ons and Themes` → gear → **Debug Add-ons** → **Load Temporary Add-on…**

## Release flow

```bash
# bump the version in manifest.json, commit, then:
git tag v0.0.2
git push github main v0.0.2   # GitHub Release automatically + mirrored to CNB Release
```

## Compatibility

Thunderbird 128+. Uses an Experiment API (`api/AccountManager/` — essentially `account.name = newName`); fine for personal use, ATN publishing would require source review.

## License

[MIT](./LICENSE)
