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

function checkBirthdayReminders() {
  Logger.log("Iniciando verificação de aniversários...");

  // Busca as credenciais de forma segura das Propriedades do Script
  const scriptProperties = PropertiesService.getScriptProperties();
  const numeroWhatsapp = scriptProperties.getProperty('WHATSAPP_NUMBER');
  const apiKeyCallMeBot = scriptProperties.getProperty('CALLMEBOT_APIKEY');

  // Valida se as propriedades foram configuradas
  if (!numeroWhatsapp || !apiKeyCallMeBot) {
    Logger.log("ERRO: As propriedades 'WHATSAPP_NUMBER' ou 'CALLMEBOT_APIKEY' não foram configuradas nas configurações do projeto.");
    return;
  }

  // --- Define as Datas ---
  const today = new Date();

  // Data de Amanhã
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDay = tomorrow.getDate();
  const tomorrowMonth = tomorrow.getMonth() + 1; // getMonth() é 0-indexed

  // Data da Próxima Semana
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekDay = nextWeek.getDate();
  const nextWeekMonth = nextWeek.getMonth() + 1;

  Logger.log(`Verificando aniversários para amanhã (${tomorrowDay}/${tomorrowMonth}) e próxima semana (${nextWeekDay}/${nextWeekMonth}).`);

  // --- Acessa os Dados da Planilha ---
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_DA_ABA);
  if (!sheet) {
    Logger.log(`ERRO: A aba chamada "${NOME_DA_ABA}" não foi encontrada.`);
    return;
  }

  // ALTERAÇÃO 1: Mudar de 3 para 4 colunas para incluir o "Ano"
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  let remindersSent = 0;

  // --- Itera sobre os Dados e Verifica as Datas ---
  data.forEach(row => {
    // Garante que a linha tenha dados válidos
    if (!row || row.length < 3) return;

    // ALTERAÇÃO 2: Adicionar a variável "year" para receber o ano de nascimento
    const [name, day, month, year] = row;

    if (name && day && month) {
      // Verifica o lembrete de 1 dia
      if (day == tomorrowDay && month == tomorrowMonth) {

        // ALTERAÇÃO 3: Calcular a idade e personalizar a mensagem
        let message = `Lembrete: Amanhã é o aniversário de ${name}! 🥳🎂`; // Mensagem padrão

        if (year) { // Se o ano foi preenchido na planilha
          const age = tomorrow.getFullYear() - year;
          message = `Lembrete: Amanhã é o aniversário de ${age} anos de ${name}! 🥳🎂`;
        }

        Logger.log(`Lembrete de 1 dia para: ${name}`);
        remindersSent++;
        sendWhatsAppMessage(message, numeroWhatsapp, apiKeyCallMeBot);
      }

      // Verifica o lembrete de 7 dias
      if (day == nextWeekDay && month == nextWeekMonth) {
        Logger.log(`Lembrete de 7 dias para: ${name}`);
        remindersSent++;
        const message = `Lembrete: Daqui a uma semana é o aniversário de ${name}! 🎉`;
        sendWhatsAppMessage(message, numeroWhatsapp, apiKeyCallMeBot);
      }
    }
  });

  if (remindersSent === 0) {
    Logger.log("Nenhum lembrete de aniversário para enviar hoje.");
  }
  Logger.log("Verificação concluída.");
}