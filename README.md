# Account F2 Renamer

**[English](./README.en.md)** | 中文

![Thunderbird](https://img.shields.io/badge/Thunderbird-128%2B-%230F8FF?logo=thunderbird&logoColor=white)
![Version](https://img.shields.io/badge/version-0.0.1-indigo)
![License](https://img.shields.io/badge/license-MIT-green)

> Thunderbird 附加组件：在文件夹面板按 **F2** 快速重命名账户名称；右键重命名文件夹 / 复制邮箱地址。

## 为什么需要它

Thunderbird 的扩展 API 对账户名称是**只读**的，附加组件商店里没有能改账户名的插件。本插件通过官方 Experiment API 调用 Thunderbird 内部接口实现——只改左侧栏显示的"账户名称"（纯本地标签），不碰"您的姓名"和邮箱地址（那些影响收发身份，改错会导致收发异常）。

## 功能

| 操作 | 方式 |
|---|---|
| **重命名账户名称** | 点选账户下任一文件夹（即选中该账户）按 **F2**；或右键 → 重命名账户（F2） |
| 重命名文件夹 | 右键文件夹 → 重命名文件夹（收件箱等系统文件夹自动隐藏该项） |
| 复制邮箱地址 | 右键任意账户/文件夹 → 复制邮箱地址（写入剪贴板并弹通知） |

弹窗内 **Enter** 保存、**Esc** 取消；快捷键可在 Thunderbird 附加组件设置 → 管理快捷键 中改绑。

## 安装

从 [Releases](https://github.com/borisxxz/thunderbird_account_renamer/releases)（或 [CNB 镜像](https://cnb.cool/boris007/thunderbird_account_renamer)）下载 zip → Thunderbird `工具 → 附加组件和主题` → 齿轮 → **调试附加组件** → **Load Temporary Add-on…**

> 临时加载重启后失效；F2 绑定加载后在 附加组件 → 齿轮 → 管理扩展快捷键 里确认。

## 发布流程

```bash
# 改 manifest.json 版本号 → 提交 →
git tag v0.0.2
git push github main v0.0.2   # GitHub 自动出 Release + 镜像同步 CNB 自动出 Release
```

> 国内网络推送失败时：`git -c http.proxy=http://127.0.0.1:7897 push github main v0.0.2`

## 兼容性

Thunderbird 128+。使用了 Experiment API（`api/AccountManager/`，核心一行 `account.name = 新名`），自用无限制；若上架 ATN 需提交源码审核。

## License

[MIT](./LICENSE)
