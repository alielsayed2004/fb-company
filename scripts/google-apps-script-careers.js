/**
 * ==============================================================================
 * F.B Company - Google Apps Script for Hiring Applications & CV Drive Storage
 * ==============================================================================
 * 
 * طريقة الاستخدام (How to Setup):
 * 1. افتح شيت جوجل جديد (Google Sheet) وسمّه مثلاً: "F.B Company - Hiring Applications"
 * 2. من القائمة العلوية اضغط: Extensions (الإضافات) -> Apps Script
 * 3. امسح أي كود موجود في المحرر وضع هذا الكود بالكامل مكانه.
 * 4. اضغط حفظ (Save) 💾
 * 5. اضغط نشر (Deploy) -> New deployment (نشر جديد)
 * 6. اختر نوع النشر: Web app (تطبيق ويب)
 * 7. الإعدادات المهمة جداً:
 *    - Description: "FB Hiring Webhook"
 *    - Execute as: "Me" (حسابك)
 *    - Who has access: "Anyone" (أي شخص)  <-- إجباري لكي يستقبل الموقع الطلبات
 * 8. اضغط Deploy ووافق على الصلاحيات (Authorize access).
 * 9. انسخ رابط الـ Web URL الناتج وضعه في متغيرات البيئة في Vercel:
 *    CAREERS_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/..../exec"
 *
 * الخصوصية (Privacy):
 * - ملفات السيرة الذاتية تُحفظ في Drive بصلاحية "مقيّد" (Restricted) فقط — لا يستطيع أحد فتحها
 *   إلا صاحب الحساب ومن تتم مشاركتهم يدوياً. لا يتم أبداً استخدام "أي شخص لديه الرابط".
 * - مهم: بعد تحديث هذا الكود يجب عمل Deploy -> Manage deployments -> Edit -> New version
 *   حتى يعمل الكود الجديد على نفس الرابط.
 * - لتقييد الملفات القديمة دفعة واحدة: شغّل الدالة restrictExistingCvs() مرة واحدة من المحرر.
 *
 * حماية اختيارية (Optional shared secret):
 * - Project Settings -> Script Properties -> أضف WEBHOOK_SECRET بقيمة عشوائية طويلة،
 *   وأضف نفس القيمة في Vercel باسم CAREERS_WEBHOOK_SECRET. عندها تُرفض أي طلبات لا تحمل السر.
 */

var CV_FOLDER_NAME = "FB_Company_Careers_CVs";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "No POST body received" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);

    // Optional shared secret (Script Property WEBHOOK_SECRET must match Vercel's CAREERS_WEBHOOK_SECRET)
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (expectedSecret && data.secret !== expectedSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Unauthorized"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "طلبات التوظيف - Applications";
    var sheet = ss.getSheetByName(sheetName);

    // إنشاء الصفحة إذا لم تكن موجودة
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // إذا كان الشيت فارغاً، نقوم بإنشاء وترتيب الأعمدة بتنسيق F.B Company المميز
    if (sheet.getLastRow() === 0) {
      var headers = [
        "تاريخ ووقت التقديم (Timestamp)",
        "الاسم الكامل (Full Name)",
        "البريد الإلكتروني (Email)",
        "رقم الهاتف (Phone)",
        "القسم المتقدم له (Department)",
        "سنوات الخبرة (Experience)",
        "تاريخ إمكانية البدء (Start Date)",
        "الراتب المتوقع (Expected Salary)",
        "رابط السيرة الذاتية في Drive (CV Link)",
        "اسم ملف السيرة الذاتية (CV File Name)",
        "الموافقة على الشروط (Consent)"
      ];
      sheet.appendRow(headers);

      // تنسيق صف العناوين باللون الكحلي الداكن والأخضر الخاص بالشركة
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#003B3C");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
      sheet.setFrozenRows(1);
    }

    // رفع وتخزين ملف السيرة الذاتية في Google Drive تلقائياً
    var cvUrl = "لم يتم إرفاق ملف";
    if (data.cvFileBase64 && data.cvFileName) {
      try {
        var folder = getCvFolder_();

        var decodedData = Utilities.base64Decode(data.cvFileBase64);
        var mimeType = data.cvFileMimeType || "application/pdf";
        var blob = Utilities.newBlob(decodedData, mimeType, (data.fullName ? data.fullName.replace(/\s+/g, '_') + '_' : '') + data.cvFileName);
        
        var driveFile = folder.createFile(blob);
        // الملف خاص: مقيّد لصاحب الحساب فقط (لا مشاركة عبر الرابط)
        driveFile.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
        cvUrl = driveFile.getUrl();
      } catch (driveError) {
        // Report failure so the website shows an error instead of a false success
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "CV upload failed: " + driveError.toString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // إضافة صف جديد ببيانات المتقدم
    var newRow = [
      data.timestamp || new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.department || "",
      data.experience || "N/A",
      data.startDate || "N/A",
      data.expectedSalary || "N/A",
      cvUrl,
      data.cvFileName || "N/A",
      data.consent || "موافق"
    ];

    sheet.appendRow(newRow);

    // تنسيق الخلايا
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, newRow.length).setVerticalAlignment("middle");
    sheet.setRowHeight(lastRow, 32);

    // تحويل رابط الـ CV إلى رابط تشعبي جذاب إذا وجد
    if (cvUrl && cvUrl.startsWith("http")) {
      var cell = sheet.getRange(lastRow, 9);
      cell.setFormula('=HYPERLINK("' + cvUrl + '", "عرض السيرة الذاتية 📄")');
      cell.setFontColor("#53B379");
      cell.setFontWeight("bold");
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Application recorded successfully",
      cvUrl: cvUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// مجلد السير الذاتية (يُنشأ خاصاً إن لم يكن موجوداً)
function getCvFolder_() {
  var folders = DriveApp.getFoldersByName(CV_FOLDER_NAME);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CV_FOLDER_NAME);
  folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  return folder;
}

// تشغيل مرة واحدة: يجعل كل الملفات الموجودة في مجلد السير الذاتية "مقيّدة"
function restrictExistingCvs() {
  var folder = getCvFolder_();
  var files = folder.getFiles();
  var count = 0;
  while (files.hasNext()) {
    var f = files.next();
    if (f.getSharingAccess() !== DriveApp.Access.PRIVATE) {
      f.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      count++;
    }
  }
  Logger.log("Restricted files: " + count);
  return count;
}

// دالة اختبار للتأكد من عمل الرابط
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "active", 
    service: "F.B Company Hiring Webhook" 
  })).setMimeType(ContentService.MimeType.JSON);
}
