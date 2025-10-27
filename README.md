# 🤖 Automated WhatsApp Birthday Reminder

A serverless automation script that sends a personal WhatsApp notification one day before a friend's birthday. This project leverages the free Google Suite (Sheets and Apps Script) to create a zero-cost, zero-maintenance solution.

<!-- ![Example Notification](https://i.imgur.com/example.png) -->

## ✨ Features

- **Daily Automation:** The script runs once a day, automatically, without any manual intervention.
- **Simple Database:** Uses a Google Sheets spreadsheet as a database, making it easy to add and manage contacts.
- **Zero Cost:** All tools used (Google Sheets, Apps Script, CallMeBot) have free tiers that are perfectly suited for this project.
- **Easy Setup:** The project can be replicated in just a few minutes by following the instructions below.

---

## 🛠️ Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **Google Sheets** | Stores the names and birth dates. |
| **Google Apps Script** | The "brain" of the automation. Runs the code in the Google Cloud. |
| **CallMeBot API** | A free API service that bridges the script with the WhatsApp messaging service. |

---

## 🚀 How to Set Up and Run This Project

Follow the steps below to get your own version up and running:

### 1. The Database (Google Sheets)

1.  Create a new spreadsheet in [Google Sheets](https://sheets.google.com).
2.  Rename the first sheet (tab) to **`Amigos`**.
3.  Set up the columns exactly as follows:
    - **Column A:** `Nome`
    - **Column B:** `Dia`
    - **Column C:** `Mês`
4.  Fill it in with your friends' data.

### 2. The Messaging API (CallMeBot)

1.  Go to the [CallMeBot website](https://www.callmebot.com/).
2.  Follow the instructions to activate the WhatsApp API for your phone number.
3.  You will receive an **`apikey`**. Save it.

### 3. The Automation Script (Google Apps Script)

1.  In your spreadsheet, navigate to `Extensions > Apps Script`.
2.  Copy the code from the `Code.gs` file in this repository and paste it into the editor.
3.  Go to **Project Settings ⚙️ > Script Properties**.
4.  Add two new properties:
    - **Property Name:** `WHATSAPP_NUMBER` | **Value:** Your WhatsApp number in `+55...` format.
    - **Property Name:** `CALLMEBOT_APIKEY` | **Value:** The `apikey` you received from CallMeBot.
5.  Save the script properties.
6.  Create a new **Trigger ⏰** for the `verificarAniversarios` function. Configure it to run on a `Time-driven` basis using a `Day-timer`.

That's it! The system will now run automatically every day.

---

## 🗺️ Future Features & Roadmap

This section outlines potential improvements and new features for the project.

-   `[ ]` **Age Calculation in Notifications:**
    -   Add a `Year` column to the Google Sheet to store the birth year.
    -   The script will then calculate the person's upcoming age and include it in the message (e.g., "Reminder: Tomorrow is Jane's 30th birthday! 🥳").

-   `[ ]` **Google Forms Integration for Easy Entry:**
    -   Create a Google Form that populates the Google Sheet. This would allow adding new birthdays from any device without directly editing the spreadsheet, making it more user-friendly.

-   `[ ]` **Advanced Reminders (1 Month Prior):**
    -   Implement an additional check to send a second notification a month before the birthday, providing more time to plan or buy a gift.

-   `[ ]` **Weekly/Monthly Digest:**
    -   Set up a secondary trigger (e.g., to run every Sunday) that sends a summary of all upcoming birthdays for the next week or month, providing a high-level overview.