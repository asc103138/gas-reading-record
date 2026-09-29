---
rdq_version: 1
task: 讀報記錄表「版面名稱」改為必填欄位
domain: dev
date: 2026-09-18
status: confirmed
telemetry:
  mode: lite
  rounds: 0
  questions: 0
  q4_adopted: 0
  revisions: 0
downstream: self
---

# RDQ 需求規格：版面名稱改必填

## 一句話任務
把 GAS 讀報記錄表的「版面名稱」欄位改為必填，前端與後端都擋空白。

## ✅ 已確認
- 「版面名稱」設為必填（Ⅰ，語音還原：必田 → **必填**）
- 專案：**D:\opencode\gas-reading-record**（GAS 讀報記錄表）（Ⅰ 環境掃描）
- 現況：**index.html** 的 #section 無必填驗證、**Code.gs** 後端也未擋（Ⅰ 環境掃描）

## ❓ 假設（未確認，已採預設值，隨時可推翻）
- 標籤文字改為「版面名稱（必填）」→ 預設採用
- 前端空白時顯示「請填寫版面名稱」並停止送出 → 預設採用
- 後端 Code.gs 同步擋空白（防繞過前端）→ 預設採用
- 只改 index.html 與 Code.gs，不動 parent.html → 預設採用

## ❌ 排除項（明確不做）
- 其他欄位（班級代號、座號等）維持選填
- 不含重新部署 GAS（併入既有「重新部署新版」任務處理）

## 📋 一段式需求規格
在 **D:\opencode\gas-reading-record** 專案中，把讀報記錄表單的「**版面名稱**」欄位（**index.html** 的 #section、**Code.gs** 的 section 欄）改為**必填**：index.html 標籤改為「版面名稱（必填）」，send() 送出前檢查空白並提示「請填寫版面名稱」；Code.gs 的 submitReading 同步驗證 section 非空白，空白則回傳錯誤。其餘欄位維持選填，parent.html 不動。修改後需複製到 GAS 專案並重新部署才會生效。

## ✔ 驗收條件
- [ ] index.html 版面名稱空白時無法送出，顯示提示
- [ ] Code.gs 後端擋住空白 section
- [ ] 其他欄位行為不變
