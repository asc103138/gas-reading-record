---
rdq_version: 1
task: 移除紀錄表頁的成果分享牆
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

# RDQ 需求規格：紀錄表移除分享牆

## 一句話任務
把「成果分享牆」從讀報記錄表（index.html）整段移除，家長頁（parent.html）維持不變。

## ✅ 已確認
- 成果分享牆不用出現在紀錄表上（Ⅰ 使用者明說）
- **parent.html** 有自己的分享牆且呼叫 getReadings()（Ⅰ 環境掃描）

## ❓ 假設（未確認，已採預設值，隨時可推翻）
- 分享牆的 CSS 與 JS 一併清除（loadWall／renderWall／createShareCard 等）→ 預設採用
- **Code.gs** 的 getReadings() 保留（家長頁要用）→ 預設採用
- parent.html 完全不動 → 預設採用

## ❌ 排除項（明確不做）
- 不刪後端 getReadings()
- 不含重新部署 GAS（併入既有「重新部署新版」任務）

## 📋 一段式需求規格
在 **D:\opencode\gas-reading-record** 的 **index.html** 中，移除整個「成果分享牆」：`<section class="share-wall">` HTML 區塊、相關 CSS（.share-wall／.wall-*／.share-*）、相關 JS（showWallStatus／addShareField／createShareCard／renderWall／loadWall、refreshWall 事件與 loadWall() 初始呼叫）。**Code.gs** 的 getReadings() 保留供 **parent.html** 使用，parent.html 不動。修改後需複製到 GAS 專案並重新部署才會生效。

## ✔ 驗收條件
- [ ] index.html 不再出現分享牆，表單送出功能正常
- [ ] 無殘留的 wall／share 相關 CSS 與 JS
- [ ] Code.gs 的 getReadings() 保留，parent.html 未動
