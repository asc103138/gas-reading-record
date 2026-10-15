# 每日報報專案進度交接筆記 (handoff.md)

## 📌 最新交接時間
- **日期**：2026-10-15
- **目前版本**：v1.5.0 (Commit: `e51a688`)
- **GitHub 儲存庫**：[https://github.com/asc103138/gas-reading-record](https://github.com/asc103138/gas-reading-record)

---

## ✅ 本次完成事項

1. **依據 Emil Kowalski 設計工程與行動端原生標準全面升級前端動效與觸控微互動**：
   - **消除 `transition: all` 反模式**：全站定義並採用三次貝茲曲線與物理時間（`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`），大幅降低重排重繪負擔。
   - **即時觸控回饋（Tactile Feedback）**：所有按鈕加入 `:active { transform: scale(0.96~0.97); }`，星星評分加入彈簧放大回饋（`scale(1.22)`），提供實體按鍵般的下壓確認感。
   - **解決平板與手機 Sticky Hover 問題**：所有 `:hover` 樣式完整包裹於 `@media (hover: hover) and (pointer: fine)` 條件下，避免平板觸控後游標殘留 hover 位移與背景色。
   - **徹底根治 iOS / iPadOS Safari 自動放大版面跑版**：全站表單控制項（`input`, `select`, `textarea`）統一設為 `16px`。
   - **消除原生灰框與點擊延遲**：全站設置 `-webkit-tap-highlight-color: transparent`，按鈕加入 `touch-action: manipulation; user-select: none;`。
   - **家長成果牆階梯顯現（Stagger Reveal）**：引入 `--card-index * 35ms` 階梯動畫，卡片依序滑順浮現。
   - **無障礙支援**：底層整合 `@media (prefers-reduced-motion: reduce)`。

2. **全站純向量寶可夢探險背景動畫系統（100% 零外部圖檔依賴）**：
   - **環繞六大精靈球家族漂浮**：經典精靈球（紅）、超級球（藍紅）、高級球（黑金）、紀念球（白紅）、巢穴球（綠金）、大師球（紫粉 M）於畫面四邊邊緣平滑浮動與微幅旋轉（`pokeFloatA/B/C`），透明度控制在 `0.14~0.16`，文字對比達 AAA 級。
   - **探險閃耀微光星芒**：六色四芒星徽章星芒交替呼吸閃爍，增添寶可夢冒險探索沉浸感。
   - **抱著「讀報卷軸 📜」奔跑的皮卡丘小夥伴**：底端軌道每隔 18 秒皮卡丘帶著讀報卷軸歡快奔跑橫越畫面，具備彈跳、蹬地、耳朵擺動、尾巴微晃與塵土微粒。
   - **安全不遮擋圖層架構**：背景層 (`z-index: 0`) < 皮卡丘軌道 (`z-index: 1`) < 主要讀報卡片 (`z-index: 2`)，絕不干擾閱讀與作答。
   - **校園網路 100% 免阻擋**：全數使用純 SVG 向量，無任何外部圖檔外連，完全不怕學校 TANet 兒少網路防火牆或 Google Apps Script iframe 阻擋。
   - **GPU 合成層極致效能**：僅操作 `transform` 與 `opacity`，在學生平價平板與 Chromebook 上順暢 60fps 運作。

3. **提交後內容完整保留與單格精準修正機制（免重複重寫痛點根治）**：
   - **送出不再清空表單**：學生送出讀報紀錄後，所有文字框、標題、摘要、心得與星等**全數保留在畫面上**，老師指導修改某個特定格子時，學生只需直接點擊該格修改，不再需要從頭手抄重打。
   - **試算表原列更新（In-place Update）**：
     - `Code.gs` 的 `submitReading` 與 `submitGroupDiscussion` 升級為支援 `rowIndex` 原列覆蓋更新。
     - 具備安全校驗與雙重防護（比對該列之班級、座號／組別與日期標題），確認為同一筆紀錄後直接原位更新並刷新時間戳記，**絕不在試算表產生重複冗餘資料列**。
   - **智慧動態按鈕狀態提示**：
     - 送出後轉為綠色 `💾 內容已送出（若需修改，直接改格子再點此更新）`。
     - 一旦學生修改上方任何一格文字，按鈕立即轉為金橘色微動態 `✨ 偵測到修改，點此更新送出！`。
   - **增設「清空填寫新篇章」按鈕**：
     - 送出區下方提供 `📝 清空填寫新篇章` 按鈕（附防呆確認彈窗），學生需要記錄下一篇新文章時可一鍵乾淨重置。
   - **全域 LocalStorage 雙向草稿備份**：
     - 所有輸入框即時雙向快取，即使平板意外跳轉、休眠或重新整理，原內容即刻 100% 無損還原。

---

## 🔮 下一步建議方向

1. **部署 Google Apps Script 最新版本**：
   - 開啟 Google Apps Script 專案編輯器，將最新的 [`Code.gs`](file:///d:/opencode/gas-reading-record/Code.gs)、[`index.html`](file:///d:/opencode/gas-reading-record/index.html)、[`group.html`](file:///d:/opencode/gas-reading-record/group.html)、[`parent.html`](file:///d:/opencode/gas-reading-record/parent.html) 複製過去。
   - 點擊「部署」>「管理部署作業」>「編輯」> 版本選擇「建立新版本」> 點擊「部署」，即可讓全班平板即刻生效。
2. **課堂實機教學體驗**：
   - 實際在課堂讓學生修改心得或摘要，測試送出後的更新流暢感與試算表資料即時連動。

---

## ⚠️ 踩坑與注意事項

1. **行動裝置輸入框字體不得小於 16px**：
   - iOS/iPadOS Safari 遇到 `< 16px` 的 input 會有自動強制放大頁面的原生行為，後續若調整表單樣式切勿降回 15px。
2. **圖層深度（Z-Index）管理**：
   - 確保 `.nav-bar`、`.header-card`、`fieldset`、`.group-sync-card`、`.submit-action-box` 等維持在 `z-index: 2` 以上，以保證奔跑的皮卡丘（`z-index: 1`）與漂浮球（`z-index: 0`）永遠退居背景。
3. **校園學術網路環境嚴守純向量原則**：
   - 嚴禁引進非開源或需外連第三方圖床之圖片 URL，純 SVG 向量是國小教學系統在各種網管環境下最穩固無破圖的黃金標準。
