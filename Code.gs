/**
 * ===================================================================
 * Automated Birthday Reminder
 * Secure Version - Uses Script Properties
 * ===================================================================
 * This script checks a Google Sheet for birthdays and sends a
 * WhatsApp reminder one day in advance.
 *
 * CONFIGURATION:
 * 1. Go to "Project Settings" ⚙️.
 * 2. Add "Script Properties":
 * - WHATSAPP_NUMBER: your_number_in_+55_format
 * - CALLMEBOT_APIKEY: your_api_key_from_callmebot
 * ===================================================================
 */

// The exact name of the sheet (tab) in your spreadsheet
const NOME_DA_ABA = "Amigos";

/**
 * The main function that will be executed by the trigger.
 * It checks for tomorrow's birthdays.
 */
function verificarAniversarios() {
  Logger.log("Starting birthday check...");

  // Securely fetch credentials from Script Properties
  const scriptProperties = PropertiesService.getScriptProperties();
  const numeroWhatsapp = scriptProperties.getProperty('WHATSAPP_NUMBER');
  const apiKeyCallMeBot = scriptProperties.getProperty('CALLMEBOT_APIKEY');

  // Validate that the properties have been set
  if (!numeroWhatsapp || !apiKeyCallMeBot) {
    Logger.log("ERROR: 'WHATSAPP_NUMBER' or 'CALLMEBOT_APIKEY' properties have not been set in the project settings.");
    return;
  }

  // Define "tomorrow's" date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDay = tomorrow.getDate();
  const tomorrowMonth = tomorrow.getMonth() + 1; // getMonth() is 0-indexed

  Logger.log(`Checking for birthdays for tomorrow: ${tomorrowDay}/${tomorrowMonth}`);

  // Access the spreadsheet and the data
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_DA_ABA);
  if (!sheet) {
    Logger.log(`ERROR: The sheet named "${NOME_DA_ABA}" was not found.`);
    return;
  }

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  let birthdaysFound = 0;

  // Iterate over each row of data
  data.forEach(row => {
    const [name, day, month] = row;

    if (name && day && month && day == tomorrowDay && month == tomorrowMonth) {
      Logger.log(`Birthday found: ${name}`);
      birthdaysFound++;
      const message = `Reminder: Tomorrow is ${name}'s birthday! 🥳🎂`;
      sendWhatsAppMessage(message, numeroWhatsapp, apiKeyCallMeBot);
    }
  });

  if (birthdaysFound === 0) {
    Logger.log("No birthdays found for tomorrow.");
  }
  Logger.log("Check complete.");
}

/**
 * Helper function to send the message via the CallMeBot API.
 * @param {string} textToSend - The message text.
 * @param {string} number - The recipient's phone number.
 * @param {string} apikey - The CallMeBot API key.
 */
function sendWhatsAppMessage(textToSend, number, apikey) {
  try {
    const encodedMessage = encodeURIComponent(textToSend);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${number}&text=${encodedMessage}&apikey=${apikey}`;

    // The "muteHttpExceptions" option prevents the script from halting on an API error
    UrlFetchApp.fetch(url, { "muteHttpExceptions": true });
    Logger.log(`API call attempted for message: "${textToSend}"`);
  } catch (e) {
    Logger.log(`Error calling the API: ${e}`);
  }
}