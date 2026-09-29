# AGENTS.md - 每日報報（寶可夢讀報探險系統）專案指引

本文件為 AntiGravity 與協同開發 Agent 的核心指引。

---

## 📌 專案概述
- **專案名稱**：每日報報 ─ 寶可夢讀報探險記錄系統 (`gas-reading-record`)
- **核心定位**：專為國小「生生用平板」課堂情境設計的讀報學習與反思記錄系統。以 Google 試算表為輕量後端資料庫，Google Apps Script (GAS) Web App 為前端介面，搭配寶可夢探險主題提升學生閱讀動機。
- **目標客群**：國小學童（學生個人、小組討論）、授課教師、家長。

---

## 🧱 系統架構與檔案清單

| 檔案 | 角色與用途 |
|---|---|
| [`Code.gs`](file:///d:/opencode/gas-reading-record/Code.gs) | 後端 GAS 核心腳本。負責網頁路由 (`doGet`)、資料讀寫 (`submitReading`、`submitGroupDiscussion`、`getTodayGroupArticles`、`getReadings`) 以及試算表結構維護 (`修正試算表`)。 |
| [`index.html`](file:///d:/opencode/gas-reading-record/index.html) | 學生個人讀報記錄表（主要入口）。包含訓練家資料、小組選篇連動卡片（免手抄一鍵帶入）、標題、內容摘要、心得、星等評分。 |
| [`group.html`](file:///d:/opencode/gas-reading-record/group.html) | 小組討論選篇室（`?page=group`）。供 1~5 組小組討論時推派一人登記本日收服篇章，送出後提供個人直通按鈕，各組選篇純私密不互窺。 |
| [`parent.html`](file:///d:/opencode/gas-reading-record/parent.html) | 家長成果分享牆（`?page=parent`）。以寶可夢卡片展示全班最新讀報成果，座號與標題同區清晰呈現。 |
| [`部署操作單.md`](file:///d:/opencode/gas-reading-record/%E9%83%A8%E7%BD%B2%E6%93%8D%E4%BD%9C%E5%96%AE.md) | 完整部署、版本更新、試算表初始化維護指引。 |
| [`README.md`](file:///d:/opencode/gas-reading-record/README.md) | 專案公開說明文件、特色介紹、使用指南。 |

---

## ⚙️ 核心開發與運作原則

1. **生生用平板・同組免手抄**：
   - 組員在個人平板打開 `index.html`，只要選擇所屬組別，即透過 `getTodayGroupArticles` 自動向後端抓取該組今日討論選定之文章。
   - 點擊按鈕一鍵自動填入「版面名稱」與「文章標題」，解決學童手動抄寫繁瑣、易拼錯字的課堂痛點。
2. **前後端不依賴外掛 / Node**：
   - 採用純 HTML + 原生 JS + CSS 打造，不需 npm/clasp 等複雜打包流程。
   - 前端所有 JS 必須寫在各自 HTML 檔案內的 `<script>` 區塊，不可另存為 `.gs`。
3. **GAS iframe 跳轉安全性**：
   - 由於 GAS 執行於 `googleusercontent.com` 的 iframe 內，頁面跳轉與導覽列一律使用 Server-side Template (`<?= scriptUrl ?>`) 與 `ScriptApp.getService().getUrl()` 傳入之絕對路徑，確保 `target="_top"` 正常運作。
4. **試算表結構維護**：
   - `回覆` 分頁（14 欄）：個人讀報記錄。
   - `小組討論` 分頁（10 欄）：小組選篇記錄。
   - 若欄位錯位或需重建，直接執行 `Code.gs` 的 `修正試算表()` 函式即可一鍵自動校正。

---

## 🛠️ 開工與收工規範
- **開工**：閱讀本文件與最近 git commit，檢查 `git status`。
- **收工**：確認無外洩敏感資訊（API Token、學生真實姓名等），更新文檔，確認後 commit 並推送。
