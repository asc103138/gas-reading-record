/**
 * 每日報報 —— 讀報記錄表（後端）
 *
 * 四個對外函式：
 *   doGet          有人打開網址 → 送出 index.html 這個網頁
 *   submitReading  前端按「送出」→ 把一筆記錄寫進試算表
 *   getReadings    前端載入成果分享牆 → 取得最新讀報紀錄
 *   一鍵授權       老師手動執行一次，用來觸發授權畫面
 *
 * 內部（底線開頭 = 私有函式，前端叫不到）：
 *   getSheet_      拿到工作表，沒有就自動建並補上標題列
 */

const SHEET_NAME = '回覆';   // 要跟試算表左下角的分頁名稱一模一樣
const GROUP_SHEET_NAME = '小組討論'; // 小組選篇討論專用分頁

// 標準 14 欄標題列（不含「報紙名稱」）
const HEADERS = [
  '時間', '讀報日期', '版面名稱', '班級代號', '座號',
  '文章標題', '關鍵詞', '內容說明', '重點摘要',
  '心得感想', '我學到的是', '疑問', '想進一步了解', '評價(1-5)'
];

// 小組討論選篇標準 10 欄標題列
const GROUP_HEADERS = [
  '時間', '讀報日期', '班級代號', '組別', '組員座號',
  '文章一版面', '文章一標題', '文章二版面', '文章二標題', '選擇理由'
];

/** 有人打開網址 → 回傳網頁 */
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || 'index';
  let fileName = 'index';
  let title = '每日報報 ─ 寶可夢讀報探險記錄表';

  if (page === 'parent') {
    fileName = 'parent';
    title = '每日報報｜寶可夢讀報成果分享';
  } else if (page === 'group') {
    fileName = 'group';
    title = '每日報報｜寶可夢小組討論選篇牆';
  }

  let scriptUrl = '';
  try {
    scriptUrl = ScriptApp.getService().getUrl();
  } catch (err) {
    // 未部署或本地執行防呆
  }

  const template = HtmlService.createTemplateFromFile(fileName);
  template.scriptUrl = scriptUrl;
  template.page = page;

  return template.evaluate()
    .setTitle(title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** 提供前端取得目前 Web App 的完整網址 */
function getScriptUrl() {
  try {
    return ScriptApp.getService().getUrl();
  } catch (err) {
    return '';
  }
}

/** 前端呼叫：寫入一筆 */
function submitReading(data) {
  // 全班同時按送出時，用鎖排隊，避免兩個人寫到同一列互相蓋掉
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);   // 最多等 10 秒
  } catch (err) {
    return { ok: false, error: '現在送出的人太多，請過幾秒再按一次' };
  }

  try {
    const section = String((data && data.section) || '').trim().slice(0, 60);
    if (!section) {
      return { ok: false, error: '請填寫版面名稱' };
    }

    const classCode = String((data && data.classCode) || '').trim().slice(0, 40);
    if (!classCode) {
      return { ok: false, error: '請填寫班級代號' };
    }

    const title = String((data && data.title) || '').trim().slice(0, 200);
    if (!title) {
      return { ok: false, error: '文章標題不能空白' };
    }

    const row = [
      new Date(),                                                    // 時間戳記（永遠第一欄）
      String((data && data.date) || '').trim().slice(0, 30),         // 讀報日期
      section,                                                       // 版面名稱（必填，例：四年級文章、自然科學）
      classCode,                                                     // 班級代號（必填）
      String((data && data.seat) || '').trim().slice(0, 20),         // 座號
      title,                                                         // 文章標題
      String((data && data.keywords) || '').trim().slice(0, 200),    // 關鍵詞（重點詞彙）
      String((data && data.content) || '').trim().slice(0, 500),     // 文章內容在說什麼？
      String((data && data.summary) || '').trim().slice(0, 500),     // 重點摘要
      String((data && data.reflection) || '').trim().slice(0, 500),  // 心得感想
      String((data && data.learned) || '').trim().slice(0, 500),     // 我學到的是…
      String((data && data.question) || '').trim().slice(0, 500),    // 我想問的是…
      String((data && data.wantToKnow) || '').trim().slice(0, 500),  // 想進一步了解的方向
      Number(data && data.rating) || 0                               // 我的評價（1~5）
    ];

    const sheet = getSheet_();
    sheet.appendRow(row);
    return { ok: true, count: sheet.getLastRow() - 1 };
  } finally {
    lock.releaseLock();   // 不管成功失敗都要放開，否則後面的人會一直等
  }
}

/** 前端呼叫：取得成果分享牆資料（最新送出的排在前面） */
function getReadings() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  // 讀取前 14 欄，不把班級代號（row[3]）送到前端以保護隱私
  const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getDisplayValues();
  return rows.reverse().map(function (row) {
    return {
      date: row[1],
      section: row[2],
      seat: row[4],
      title: row[5],
      keywords: row[6],
      content: row[7],
      summary: row[8],
      reflection: row[9],
      learned: row[10],
      question: row[11],
      wantToKnow: row[12],
      rating: row[13]
    };
  });
}

/** 內部用：拿到工作表，沒有就自動建一個並補上標題列 */
function getSheet_() {
  // 路線 A（從試算表的「擴充功能」開的）用這行：
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 路線 B（從 script.google.com 開的獨立腳本）改成這行，並填入你的試算表 ID：
  // const ss = SpreadsheetApp.openById('把試算表 ID 貼在這裡');

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // 不管分頁是「新建」還是「事先存在的空表」，只要沒有資料列就補上標題列
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** 內部用：拿到小組討論工作表，沒有就自動建一個並補上標題列 */
function getGroupSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(GROUP_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(GROUP_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(GROUP_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** 前端呼叫：寫入一筆小組討論選篇紀錄 */
function submitGroupDiscussion(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return { ok: false, error: '現在送出的人太多，請過幾秒再按一次' };
  }

  try {
    const group = String((data && data.group) || '').trim();
    if (!group) {
      return { ok: false, error: '請選擇小組組別' };
    }

    const classCode = String((data && data.classCode) || '').trim().slice(0, 40);
    if (!classCode) {
      return { ok: false, error: '請填寫班級代號' };
    }

    const section1 = String((data && data.section1) || '').trim().slice(0, 60);
    if (!section1) {
      return { ok: false, error: '請填寫第一篇文章的版面名稱' };
    }

    const title1 = String((data && data.title1) || '').trim().slice(0, 200);
    if (!title1) {
      return { ok: false, error: '請填寫第一篇文章標題' };
    }

    const section2 = String((data && data.section2) || '').trim().slice(0, 60);
    const title2 = String((data && data.title2) || '').trim().slice(0, 200);

    const row = [
      new Date(),                                                   // 時間戳記
      String((data && data.date) || '').trim().slice(0, 30),        // 讀報日期
      String((data && data.classCode) || '').trim().slice(0, 40),   // 班級代號
      group,                                                        // 組別（例：第 1 組）
      String((data && data.members) || '').trim().slice(0, 100),    // 組員座號（例：3, 7, 12, 19）
      section1,                                                     // 文章一版面
      title1,                                                       // 文章一標題
      section2,                                                     // 文章二版面（選填）
      title2,                                                       // 文章二標題（選填）
      String((data && data.reason) || '').trim().slice(0, 500)      // 選擇理由／討論心得
    ];

    const sheet = getGroupSheet_();
    sheet.appendRow(row);
    return { ok: true, count: sheet.getLastRow() - 1 };
  } finally {
    lock.releaseLock();
  }
}

/**
 * 前端呼叫：查詢特定小組今天討論選定的文章
 * 讓組員在個人讀報時一鍵自動帶入，免去手動抄寫標題與版面的困擾
 */
function getTodayGroupArticles(params) {
  try {
    const sheet = getGroupSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { ok: true, found: false, articles: [] };
    }

    const targetGroup = String((params && params.group) || '').trim();
    const targetDate = String((params && params.date) || '').trim();
    const targetClass = String((params && params.classCode) || '').trim();

    if (!targetGroup) {
      return { ok: false, error: '請指定要查詢的組別' };
    }

    // 倒序讀取，優先抓取最新一筆該組紀錄
    const rows = sheet.getRange(2, 1, lastRow - 1, GROUP_HEADERS.length).getDisplayValues().reverse();

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rDate = String(r[1] || '').trim();
      const rClass = String(r[2] || '').trim();
      const rGroup = String(r[3] || '').trim();

      // 檢查組別
      if (rGroup !== targetGroup) continue;

      // 若有提供日期，檢查日期是否吻合
      if (targetDate && rDate && rDate !== targetDate) continue;

      // 若有提供班級代號，檢查班級是否吻合（去除空白容錯比對）
      if (targetClass && rClass) {
        const cleanTarget = targetClass.replace(/\s+/g, '').toLowerCase();
        const cleanR = rClass.replace(/\s+/g, '').toLowerCase();
        if (cleanR !== cleanTarget && cleanR.indexOf(cleanTarget) === -1 && cleanTarget.indexOf(cleanR) === -1) {
          continue;
        }
      }

      const articles = [];
      if (r[6]) { // title1
        articles.push({ section: r[5] || '', title: r[6] });
      }
      if (r[8]) { // title2
        articles.push({ section: r[7] || '', title: r[8] });
      }

      if (articles.length > 0) {
        return {
          ok: true,
          found: true,
          date: rDate,
          group: rGroup,
          classCode: rClass,
          articles: articles
        };
      }
    }

    return { ok: true, found: false, articles: [] };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/** 前端呼叫：取得小組討論選篇資料（最新送出的排在前面） */
function getGroupDiscussions() {
  const sheet = getGroupSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, GROUP_HEADERS.length).getDisplayValues();
  return rows.reverse().map(function (row) {
    return {
      date: row[1],
      classCode: row[2],
      group: row[3],
      members: row[4],
      section1: row[5],
      title1: row[6],
      section2: row[7],
      title2: row[8],
      reason: row[9]
    };
  });
}

/**
 * 手動維護：一鍵修正試算表標題列
 * 1. 自動偵測「報紙名稱」（或包含「報紙」）的欄位並刪除該欄，讓後方錯位的資料（班級、座號、標題）自動左移歸位
 * 2. 將第一列重新設定為標準 14 欄標題列並凍結第一列
 * 3. 同步初始化「小組討論」分頁與標準 10 欄標題列
 */
function 修正試算表() {
  const sheet = getSheet_();
  const lastCol = sheet.getLastColumn();
  
  if (sheet.getLastRow() > 0 && lastCol > 0) {
    const currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    let removed = false;
    
    // 檢查是否有「報紙名稱」或包含「報紙」的欄位，由右向左檢查刪除，避免索引偏移
    for (let c = currentHeaders.length - 1; c >= 0; c--) {
      const headerText = String(currentHeaders[c] || '').trim();
      if (headerText === '報紙名稱' || headerText.indexOf('報紙') !== -1) {
        sheet.deleteColumn(c + 1);
        Logger.log('✅ 已偵測並刪除第 ' + (c + 1) + ' 欄（' + headerText + '），資料已自動向左歸位！');
        removed = true;
      }
    }

    if (!removed && lastCol === 15) {
      Logger.log('ℹ️ 目前試算表共有 15 欄，若第 3 欄為舊報紙欄位，可手動刪除第 C 欄。');
    }
  }

  // 將第一列更新為標準 14 欄標題
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  Logger.log('✅ 個人讀報表標題列已重設為標準 14 欄：' + HEADERS.join('、'));
  Logger.log('目前共有 ' + Math.max(0, sheet.getLastRow() - 1) + ' 筆個人讀報紀錄。');

  // 同步初始化小組討論分頁
  const groupSheet = getGroupSheet_();
  groupSheet.getRange(1, 1, 1, GROUP_HEADERS.length).setValues([GROUP_HEADERS]);
  groupSheet.setFrozenRows(1);
  Logger.log('✅ 小組討論分頁標題列已重設為標準 10 欄：' + GROUP_HEADERS.join('、'));
}

/** 只給老師手動執行一次，用來觸發授權畫面（見部署步驟） */
function 一鍵授權() {
  修正試算表();
}
