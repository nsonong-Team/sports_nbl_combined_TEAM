const SHEET_NAME = 'ข้อมูล';
const HEADERS = ['วันที่บันทึก','เดือน/ปี','อำเภอ','ลำดับ','กิจกรรม','หน่วยนับ','ผลงานประจำเดือน','ผลงานสะสม'];

const DISTRICT_LIST = [
  'เมืองหนองบัวลำภู','นากลาง','ศรีบุญเรือง','สุวรรณคูหา','โนนสัง','นาวัง'
];

function getSheet() {
  const ss = SpreadsheetApp.openById('1yKeEk4YyrlleA3_YZLuhwCtlCfgFa_d3Htz59KwVO18');
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.getSheets()[0];
  return sheet;
}

// ── ตอบกลับแบบ JSONP ถ้ามี callback, ไม่งั้นตอบ JSON ──
function respond(obj, e) {
  const cb = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : '';
  const json = JSON.stringify(obj);
  if (cb) {
    return ContentService
      .createTextOutput(cb + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ══ doGet ══
function doGet(e) {
  const action     = (e && e.parameter && e.parameter.action)     || '';
  const period     = (e && e.parameter && e.parameter.period)     || '';
  const district   = (e && e.parameter && e.parameter.district)   || '';
  const fiscalYear = (e && e.parameter && e.parameter.fiscalYear) || '';
  const scope      = (e && e.parameter && e.parameter.scope)      || 'district';

  // mode บันทึก
  if (action === 'save') {
    try {
      const raw  = (e && e.parameter && e.parameter.data) || '{}';
      const data = JSON.parse(decodeURIComponent(raw));
      return saveData(data, e);
    } catch(err) {
      return respond({ success: false, error: 'parse error: ' + err.message }, e);
    }
  }

  // ไม่มี period → ส่งสถานะ
  if (!period && !fiscalYear) {
    return respond({ status: 'ready', latestPeriod: getLatestPeriod() }, e);
  }

  // ดึงข้อมูล
  try {
    const sheet = getSheet();
    const data  = sheet.getDataRange().getValues();
    if (data.length <= 1) return respond({ success: true, activities: [] }, e);

    const rows = data.slice(1).filter(function(r) {
      const rowPeriod   = String(r[1]).trim();
      const rowDistrict = String(r[2]).trim();
      const matchPeriod = fiscalYear
        ? rowPeriod.indexOf('ปีงบประมาณ ' + fiscalYear) >= 0
        : rowPeriod === period.trim();
      if (!matchPeriod) return false;
      if (scope === 'province') return true;
      if (district) return rowDistrict === district;
      return DISTRICT_LIST.indexOf(rowDistrict) >= 0;
    });

    const map = {};
    rows.forEach(function(r) {
      const key = String(r[3]);
      if (!map[key]) map[key] = { id: r[3], name: r[4], unit: r[5], monthly: 0, cumulative: 0 };
      map[key].monthly    += Number(r[6]) || 0;
      map[key].cumulative += Number(r[7]) || 0;
    });

    return respond({
      success: true,
      period: period || fiscalYear,
      district: district,
      scope: scope,
      activities: Object.keys(map).map(function(k){ return map[k]; })
    }, e);

  } catch(err) {
    return respond({ success: false, error: err.message }, e);
  }
}

// ══ doPost ══
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return saveData(data, e);
  } catch(err) {
    return respond({ success: false, error: err.message }, e);
  }
}

// ══ saveData ══
function saveData(data, e) {
  try {
    const sheet    = getSheet();
    const period   = data.period   || '';
    const district = data.district || '';
    const rows     = data.activities || [];

    if (!period || !district) {
      return respond({ success: false, error: 'ไม่ระบุ period หรือ district' }, e);
    }

    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    deleteExistingRows(sheet, period, district);

    const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    rows.forEach(function(row) {
      sheet.appendRow([
        now, period, district,
        row.id, row.name, row.unit,
        Number(row.monthly)    || 0,
        Number(row.cumulative) || 0
      ]);
    });

    return respond({ success: true, saved: rows.length, period: period, district: district }, e);

  } catch(err) {
    return respond({ success: false, error: err.message }, e);
  }
}

// ══ deleteExistingRows ══
function deleteExistingRows(sheet, period, district) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;
  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][1]).trim() === period.trim() &&
        String(data[i][2]).trim() === district.trim()) {
      sheet.deleteRow(i + 2);
    }
  }
}

// ══ getLatestPeriod ══
function getLatestPeriod() {
  try {
    const sheet   = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return '';
    const periods = sheet.getRange(2, 2, lastRow - 1, 1).getValues()
      .map(function(r){ return String(r[0]).trim(); })
      .filter(function(p){ return p; });
    return periods[periods.length - 1] || '';
  } catch(err) { return ''; }
}