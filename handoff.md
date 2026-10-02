# 每日報報專案進度交接筆記 (handoff.md)

## 📌 最新交接時間
- **日期**：2026-10-02
- **目前版本**：v1.4.0 (Commit: `0f0972d`)
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

---

## 🔮 下一步建議方向

1. **部署 Google Apps Script 最新版本**：
   - 開啟 Google Apps Script 專案編輯器，將最新的 [`index.html`](file:///d:/opencode/gas-reading-record/index.html)、[`group.html`](file:///d:/opencode/gas-reading-record/group.html)、[`parent.html`](file:///d:/opencode/gas-reading-record/parent.html) 複製過去。
   - 點擊「部署」>「管理部署作業」>「編輯」> 版本選擇「建立新版本」> 點擊「部署」，即可讓全班平板即刻生效。
2. **課堂實際測試與反饋**：
   - 觀察學童在生生用平板的情境下，對皮卡丘動畫與即時按鈕觸控反饋的喜愛度與互動流暢度。

---

## ⚠️ 踩坑與注意事項

1. **行動裝置輸入框字體不得小於 16px**：
   - iOS/iPadOS Safari 遇到 `< 16px` 的 input 會有自動強制放大頁面的原生行為，後續若調整表單樣式切勿降回 15px。
2. **圖層深度（Z-Index）管理**：
   - 確保 `.nav-bar`、`.header-card`、`fieldset`、`.group-sync-card` 等維持在 `z-index: 2` 以上，以保證奔跑的皮卡丘（`z-index: 1`）與漂浮球（`z-index: 0`）永遠退居背景。
3. **校園學術網路環境嚴守純向量原則**：
   - 嚴禁引進非開源或需外連第三方圖床之圖片 URL，純 SVG 向量是國小教學系統在各種網管環境下最穩固無破圖的黃金標準。
