# 前端規格書：Webdesigner FishingWeb（HTML / CSS / JavaScript）

## 目的與範圍
本規格書定義本專案前端（HTML、CSS、JavaScript）的功能、介面、無障礙、安全性、效能與開發部署要求。範圍包括：
- 提供最多 10 個包裹追蹤號碼的輸入介面
- 前端即時驗證（僅允許數字，最大長度控管）
- 非阻塞式使用者回饋（替代 alert）
- 響應式與可及性（A11y）需求
- 未包含後端 API 規格（若需串接，另行定義）

## 使用者故事（簡要）
- 使用者可以在多個欄位輸入追蹤號碼，點選「送出」後得到送出成功或錯誤的清晰回饋。
- 使用者可用鍵盤操作（Tab/Enter）完成資料輸入與送出流程。

## 主要功能
- 動態產生 1~10 列輸入欄位，每列含序號 label 與 `input`。
- `input` 僅允許數字輸入；每欄最大長度 12。
- `清除` 按鈕清空所有欄位；`確認送出` 收集非空欄位並顯示回饋（未串接後端時顯示摘要回饋，串接時發出 POST）。

## 無障礙（A11y）要點
- 每個輸入欄必須有對應 `label` 且 `for` 屬性對應 `input#id`。
- 提示與錯誤訊息使用可被螢幕閱讀器讀取的區塊，增加 `role="status"` 或 `aria-live="polite"`。
- 按鈕、輸入要有明顯 `:focus` 樣式，並保證對比度符合 WCAG AA（文字對背景至少 4.5:1）。
- 表單流程應支援鍵盤操作：`Tab` 導覽、`Enter` 在適當時送出。若使用動態新增欄，確保序號與欄位順序在 DOM 中保持一致。 

## HTML 規範
- 文件設定：`<!doctype html>`、`<html lang="zh-TW">`、`<meta charset="utf-8">`、`<meta name="viewport" content="width=device-width,initial-scale=1">`。
- 關鍵區塊（建議 DOM 範例）
  - `header.header`：logo、主選單（`nav`）、搜尋容器（如有）。
  - `main`：`<section class="form-wrapper">` 包含輸入表單與訊息區 `div#messageArea[role="status"]`。
  - `#input-container`：動態注入輸入列的容器。
  - 按鈕：`button#clearBtn`、`button#submitBtn`。
- 命名慣例：採用 BEM 或一致性的 class 命名（例如 `.form-wrapper__row`, `.form-wrapper__label`, `.form-wrapper__input`）。
- 表單輸入屬性：每個 `input` 要有 `id`、`name`（若會送表單）、`maxlength`、`inputmode="numeric"`、`aria-label` 或以 `label` 關聯。

## CSS 規範
- 使用 CSS 變數管理主色、成功/錯誤色、間距與字級：例如 `--color-primary`, `--color-success`, `--gap`。
- 斷點（至少）：
  - 大螢幕：> 1024px
  - 平板：>= 768px && <=1024px
  - 手機：< 768px（特別處理 <480px）
- 響應式行為：
  - `.form-wrapper` 寬度以 `%` 或 `max-width` 控制，避免固定寬度輸入導致橫向捲動。
  - 按鈕與輸入在小螢幕改為堆疊排列。
- 可視回饋：定義 `:hover`, `:active`, `:focus`, `:disabled` 樣式。
- 可及性樣式：`outline` 或 box-shadow 作為 focus 顯示（不可只依靠 color change）。
- 圖片：使用 `max-width:100%` 與 `height:auto`，建議使用壓縮過的檔案與 `srcset`（如有多尺寸）。

## JavaScript 規範
- 架構：在 `DOMContentLoaded` 後初始化，將 DOM 操作封裝成純函式：
  - `createInputRow(index): HTMLElement`
  - `mountInputRows(count)`
  - `clearAll()`
  - `gatherTrackingNumbers(): string[]`
  - `validateNumber(str): boolean`
  - `showMessage(text, type)`（type: success|error|info）
- 驗證規則：
  - 僅允許數字（可用 `inputmode="numeric"` + JS filter），`maxlength = 12`。
  - 送出前再次驗證非空與格式（如需更嚴格可以加入 checksum 或格式規則）。
- 使用者回饋：
  - 不使用 `alert`，改用頁內訊息區（`#messageArea[role="status"]`），並在訊息出現時設定適當類別 `message--error` / `message--success`。
- 若需與後端串接：
  - `POST /api/track`，body JSON：{ "numbers": ["...", "..."] }
  - 非同步流程需處理 loading 狀態（按鈕 disable + loading spinner）與錯誤代碼顯示。
- 錯誤處理與重試：簡單重試機制（例如 1 次），並暴露給使用者可見的錯誤訊息。
- 可測試性：函式應回傳可斷言的值（例如 `gatherTrackingNumbers()` 回傳陣列），方便單元測試。

## 安全與隱私
- 輸入資料在前端僅做驗證與傳送，不在本地持久化敏感資訊。
- 與後端通訊使用 HTTPS，避免將敏感參數放在 URL。
- 不要在 UI 或 alert 中直接顯示未處理之原始輸入資料（以免洩露）。

## 效能
- 壓縮並優化圖片資源，若可使用 `webp` 或更現代格式。
- CSS 與 JS 最小化，若檔案量增大採用打包與代碼分割。
- 若頁面資源多，採用 lazy-loading 與 defer/async 屬性載入非必要腳本。

## 開發與部署
- 檔案格式：規格以 Markdown 儲存於 `/plan/frontend_spec.md`（或專案 `specs/` 資料夾）。
- 版本控制：所有變更需經 Git 管理，PR 中包含變更說明與 screenshot（若有 UI 變動）。
- Lint / Format：採用 ESLint + Prettier（或符合專案既有設定）。
- 自動化測試：對 JS 行為（驗證、gather functions）撰寫單元測試，建議使用 Jest 或等價工具。

## 驗證清單（驗收條件）
1. 每個輸入欄皆有 `label for` 對應 `id`。
2. `input` 只接受數字，且 `maxlength` 正確生效。
3. 按 `確認送出` 時，若未輸入號碼顯示錯誤訊息；若有輸入則顯示成功訊息（或發出 API 請求並依回應顯示訊息）。
4. 手機、平板、桌面三種常用寬度下 UI 無橫向溢出，功能可正常操作。
5. 使用鍵盤可完整操作（Tab/Enter），focus 樣式顯示正常。

## 例外與邊界情況
- 空表單送出：顯示錯誤資訊並阻止送出。
- 重複號碼：可視需求警告或自動去重後送出。
- 非法字元或超長：標示該欄並給予錯誤說明。
- 網路錯誤：顯示可理解錯誤並允許重試。

## 附錄：實作範例（簡要）
- HTML 範例片段：
  - `section.form-wrapper > div#input-container`（動態注入）
  - `div#messageArea[role="status" aria-live="polite"]`
- CSS 變數：
  - `:root { --color-primary: #2e8b57; --color-error: #d9534f; --gap: 16px; }`
- JS 函式清單（需實作）：
  - `createInputRow(index)`, `mountInputRows(count)`, `clearAll()`, `gatherTrackingNumbers()`, `validateNumber()`。


---
