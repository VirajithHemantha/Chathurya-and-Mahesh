// ============================================================
// Google Apps Script — Chathurya & Mahesh Wedding
// Spreadsheet: https://docs.google.com/spreadsheets/d/1endkLuhzFhQPUuzy4FZZKp7VgJQKZIPVewYZcm5KUW8
//
// HOW TO DEPLOY:
// 1. Open the spreadsheet above → Extensions → Apps Script
// 2. Delete any existing code and paste this entire code
// 3. (Optional) In the toolbar dropdown, select "initializeSheets" and click "Run"
//    to immediately generate both "RSVP" and "Wishes" sheets with styled headers!
// 4. Click "Deploy" → "New deployment"
// 5. Select type: "Web app" (gear icon)
//    - Description: Wedding RSVP & Wishes API
//    - Execute as: Me (<your-email>)
//    - Who has access: Anyone
// 6. Click "Deploy" and authorize access if prompted.
// 7. Copy the generated Web App URL and paste it into:
//    - src/config.ts (GOOGLE_SCRIPT_URL) or your .env file
// ============================================================

var SPREADSHEET_ID = "1endkLuhzFhQPUuzy4FZZKp7VgJQKZIPVewYZcm5KUW8";

// ─────────────────────────────────────────────────────────────
// doPost — handles incoming form submissions for RSVP & Wishes
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockError) {
    return jsonResponse_({
      result: "error",
      error: "Server is busy. Please try again shortly."
    });
  }

  try {
    var doc = getSpreadsheet_();
    var payload = parsePayload_(e);

    // Identify target sheet: RSVP or Wishes
    var targetSheetName = resolveSheetName_(payload);
    var sheet = doc.getSheetByName(targetSheetName);

    // Auto-create sheet if it does not exist yet
    if (!sheet) {
      sheet = doc.insertSheet(targetSheetName);
      setupSheetHeaders_(sheet, targetSheetName);
    } else if (sheet.getLastRow() === 0) {
      // If sheet exists but is empty, add headers
      setupSheetHeaders_(sheet, targetSheetName);
    }

    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || "Asia/Colombo",
      "yyyy-MM-dd HH:mm:ss"
    );

    var row = [];

    if (targetSheetName === "RSVP") {
      var name = payload.name || payload.fullName || "";
      var guests = payload.guests || payload.guestCount || "1";
      var dietary = payload.dietary || payload.dietaryNotes || payload.dietaryRestrictions || "-";
      var attendance = payload.attendance || payload.attending || "Yes";

      row = [timestamp, name, guests, dietary, attendance];
    } else {
      // Wishes / Blessings sheet
      var guestName = payload.name || payload.fullName || payload.guestName || "Anonymous";
      var message = payload.message || payload.wishes || payload.blessing || "";

      row = [timestamp, guestName, message];
    }

    sheet.appendRow(row);

    // Style the newly appended data row
    formatNewRow_(sheet, targetSheetName, sheet.getLastRow());

    return jsonResponse_({
      result: "success",
      sheet: targetSheetName,
      row: sheet.getLastRow(),
      timestamp: timestamp
    });

  } catch (err) {
    Logger.log("Error in doPost: " + err.toString());
    return jsonResponse_({
      result: "error",
      error: err.toString()
    });

  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

// ─────────────────────────────────────────────────────────────
// doGet — health check endpoint & deployment verification
// ─────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var doc = getSpreadsheet_();
    var sheets = doc.getSheets().map(function(s) { return s.getName(); });

    return jsonResponse_({
      status: "ok",
      message: "Chathurya & Mahesh Wedding — RSVP and Wishes API is active!",
      spreadsheetTitle: doc.getName(),
      availableSheets: sheets
    });
  } catch (err) {
    return jsonResponse_({
      status: "error",
      error: err.toString()
    });
  }
}

// ─────────────────────────────────────────────────────────────
// initializeSheets — RUN MANUALLY ONCE to pre-create both sheets
// In Apps Script editor: Select "initializeSheets" and click "Run"
// ─────────────────────────────────────────────────────────────
function initializeSheets() {
  var doc = getSpreadsheet_();
  var sheetConfigs = ["RSVP", "Wishes"];

  sheetConfigs.forEach(function(name) {
    var sheet = doc.getSheetByName(name);
    if (!sheet) {
      sheet = doc.insertSheet(name);
      setupSheetHeaders_(sheet, name);
      Logger.log("✓ Created and styled new sheet: " + name);
    } else {
      if (sheet.getLastRow() === 0) {
        setupSheetHeaders_(sheet, name);
        Logger.log("✓ Added headers to existing empty sheet: " + name);
      } else {
        Logger.log("ℹ Sheet already exists with data: " + name);
      }
    }
  });

  // Remove default empty "Sheet1" if it exists and both RSVP and Wishes exist
  var defaultSheet = doc.getSheetByName("Sheet1");
  if (defaultSheet && defaultSheet.getLastRow() === 0 && doc.getSheets().length > 1) {
    try {
      doc.deleteSheet(defaultSheet);
      Logger.log("✓ Cleaned up empty default Sheet1");
    } catch (_) {}
  }

  Logger.log("🎉 Successfully initialized wedding sheets!");
}

// ─────────────────────────────────────────────────────────────
// setupSheetHeaders_ — creates and formats header row
// ─────────────────────────────────────────────────────────────
function setupSheetHeaders_(sheet, sheetName) {
  var headers = [];
  var colWidths = [];
  var primaryColor = "#722F37"; // Deep Burgundy matching wedding theme
  var textColor = "#FFFFFF";

  if (sheetName === "RSVP") {
    headers = [["Timestamp", "Full Name", "No. of Guests", "Dietary Notes", "Attending"]];
    colWidths = [160, 220, 110, 260, 110];
  } else {
    // Wishes
    headers = [["Timestamp", "Guest Name", "Message / Blessing"]];
    colWidths = [160, 220, 480];
  }

  // Clear existing row 1 if any and insert headers
  var headerRange = sheet.getRange(1, 1, 1, headers[0].length);
  headerRange.setValues(headers);

  // Apply elegant styling
  headerRange
    .setFontFamily("Georgia")
    .setFontSize(11)
    .setFontWeight("bold")
    .setFontColor(textColor)
    .setBackground(primaryColor)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Set explicit column widths
  for (var i = 0; i < colWidths.length; i++) {
    sheet.setColumnWidth(i + 1, colWidths[i]);
  }
}

// ─────────────────────────────────────────────────────────────
// formatNewRow_ — styles each submitted row cleanly
// ─────────────────────────────────────────────────────────────
function formatNewRow_(sheet, sheetName, rowNum) {
  var numCols = sheetName === "RSVP" ? 5 : 3;
  var rowRange = sheet.getRange(rowNum, 1, 1, numCols);

  rowRange
    .setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle");

  sheet.setRowHeight(rowNum, 28);

  // Center timestamp
  sheet.getRange(rowNum, 1).setHorizontalAlignment("center");

  if (sheetName === "RSVP") {
    // Center guests and attendance
    sheet.getRange(rowNum, 3).setHorizontalAlignment("center");
    sheet.getRange(rowNum, 5).setHorizontalAlignment("center");
    // Enable wrapping for dietary notes
    sheet.getRange(rowNum, 4).setWrap(true);
  } else if (sheetName === "Wishes") {
    // Enable text wrapping for wish messages
    sheet.getRange(rowNum, 3).setWrap(true);
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function resolveSheetName_(payload) {
  var requested = (payload.sheet || payload.type || "").toString().trim().toLowerCase();

  if (requested.indexOf("rsvp") !== -1) {
    return "RSVP";
  }
  if (requested.indexOf("wish") !== -1 || requested.indexOf("blessing") !== -1) {
    return "Wishes";
  }

  // Fallback detection based on payload fields
  if (payload.guests || payload.attendance || payload.dietary) {
    return "RSVP";
  }
  if (payload.message) {
    return "Wishes";
  }

  return "RSVP";
}

function parsePayload_(e) {
  if (!e) return {};

  // Check URL/FormData parameters
  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return e.parameter;
  }

  // Check POST body contents (JSON or URL-encoded)
  if (e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return parseQueryString_(raw);
    }
  }

  return {};
}

function parseQueryString_(query) {
  var out = {};
  var pairs = String(query).split("&");
  for (var i = 0; i < pairs.length; i++) {
    var part = pairs[i];
    if (!part) continue;
    var idx = part.indexOf("=");
    var rawKey = idx >= 0 ? part.slice(0, idx) : part;
    var rawValue = idx >= 0 ? part.slice(idx + 1) : "";
    var key = decodeURIComponent(rawKey.replace(/\+/g, " "));
    var value = decodeURIComponent(rawValue.replace(/\+/g, " "));
    out[key] = value;
  }
  return out;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
