/**
 * ===================================================================
 * Automated Birthday Reminder
 * Secure Version - Uses Script Properties
 * ===================================================================
 * This script checks a Google Sheet for birthdays and sends a
 * WhatsApp reminder 1 day and 7 days in advance.
 *
 * CONFIGURATION:
 * 1. Go to "Project Settings" ⚙️.
 * 2. Add "Script Properties":
 * - WHATSAPP_NUMBER: your_number_in_+55_format
 * - CALLMEBOT_APIKEY: your_api_key_from_callmebot
 * ===================================================================
 */

// Configure the name of your sheet here
const SHEET_NAME = "NOME_DA_ABA"; // <-- CHANGE THIS TO YOUR SHEET'S NAME

function checkBirthdayReminders() {
  Logger.log("Starting birthday check...");

  // Securely fetch credentials from Script Properties
  const scriptProperties = PropertiesService.getScriptProperties();
  const whatsappNumber = scriptProperties.getProperty('WHATSAPP_NUMBER');
  const callMeBotApiKey = scriptProperties.getProperty('CALLMEBOT_APIKEY');

  // Validate if the properties have been set
  if (!whatsappNumber || !callMeBotApiKey) {
    Logger.log("ERROR: The 'WHATSAPP_NUMBER' or 'CALLMEBOT_APIKEY' properties have not been set in the project settings.");
    return;
  }

  // --- Define Dates ---
  const today = new Date();

  // Tomorrow's Date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDay = tomorrow.getDate();
  const tomorrowMonth = tomorrow.getMonth() + 1; // getMonth() is 0-indexed

  // Next Week's Date
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekDay = nextWeek.getDate();
  const nextWeekMonth = nextWeek.getMonth() + 1;

  Logger.log(`Checking for birthdays for tomorrow (${tomorrowDay}/${tomorrowMonth}) and next week (${nextWeekDay}/${nextWeekMonth}).`);

  // --- Access Spreadsheet Data ---
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log(`ERROR: The sheet named "${SHEET_NAME}" was not found.`);
    return;
  }

  // CHANGE 1: Change from 3 to 4 columns to include "Year"
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  let remindersSent = 0;

  // --- Iterate Over Data and Check Dates ---
  data.forEach(row => {
    // Ensure the row has valid data
    if (!row || row.length < 3) return;

    // CHANGE 2: Add the "year" variable to receive the birth year
    const [name, day, month, year] = row;

    if (name && day && month) {
      // Check for the 1-day reminder
      if (day == tomorrowDay && month == tomorrowMonth) {

        // CHANGE 3: Calculate the age and customize the message
        let message = `Reminder: Tomorrow is ${name}'s birthday! 🥳🎂`; // Default message

        if (year) { // If the year was filled in the sheet
          const age = tomorrow.getFullYear() - year;
          message = `Reminder: Tomorrow is ${name}'s ${age}th birthday! 🥳🎂`;
        }

        Logger.log(`1-day reminder for: ${name}`);
        remindersSent++;
        sendWhatsAppMessage(message, whatsappNumber, callMeBotApiKey);
      }

      // Check for the 7-day reminder
      if (day == nextWeekDay && month == nextWeekMonth) {
        Logger.log(`7-day reminder for: ${name}`);
        remindersSent++;
        const message = `Reminder: In one week, it's ${name}'s birthday! 🎉`;
        sendWhatsAppMessage(message, whatsappNumber, callMeBotApiKey);
      }
    }
  });

  if (remindersSent === 0) {
    Logger.log("No birthday reminders to send today.");
  }
  Logger.log("Check complete.");
}

// NOTE: You must also have the sendWhatsAppMessage function in your script.
// If not, here is a basic version of it.
/*
function sendWhatsAppMessage(message, number, apikey) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(number)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`;
  try {
    UrlFetchApp.fetch(url);
    Logger.log(`Message sent to ${number}: "${message}"`);
  } catch (e) {
    Logger.log(`Error sending message to ${number}: ${e.toString()}`);
  }
}
*/