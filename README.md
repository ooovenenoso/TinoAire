# Air Quality Report Automation using Google Apps Script

This Google Apps Script automates the process of fetching air quality data from the IQAir API for specified locations and sends a daily email report. The script reads locations from a Google Sheets spreadsheet, retrieves the Air Quality Index (AQI) data, and emails a formatted report to the specified recipients.

## Features

- Fetches AQI data for multiple locations using the IQAir API.
- Handles API rate limits with retries and delays between requests.
- Generates a well-formatted HTML email with the AQI data.
- Automatically sends the email report at a specified time each day.
- Customizable email content and styling.

## Prerequisites

- A Google Account.
- Access to Google Drive and Google Sheets.
- An IQAir API key. You can obtain one by signing up at [IQAir AirVisual API](https://www.iqair.com/air-pollution-data-api).

## Setup Instructions

### 1. Create the Spreadsheet

- Create a new Google Sheets spreadsheet.
- Add the following headers in the first row:
  - `Location`
  - `Latitude`
  - `Longitude`
- Fill in the subsequent rows with the locations you want to monitor and their corresponding latitude and longitude coordinates.

### 2. Create the Script

- Open the Google Sheets spreadsheet you just created.
- Go to `Extensions` > `Apps Script` to open the Apps Script editor.
- Delete any placeholder code in the editor.

### 3. Copy the Script Code

- Copy the contents of the `main.gs` file provided below.
- Paste the code into the Apps Script editor.

### 4. Configure the Script

- Replace `'YOUR_IQAIR_API_KEY'` with your actual IQAir API key.
- Replace `'recipient@example.com'` with the email address where you want to send the report.
- (Optional) Adjust the time zone and trigger time if needed.

### 5. Set Up Permissions

- Click on the `Save` icon to save your script.
- Go to `Run` > `sendDailyReport` to execute the script for the first time.
- You will be prompted to authorize the script to access your Google Account data. Follow the prompts to grant the necessary permissions.

### 6. Set Up the Daily Trigger

- In the Apps Script editor, go to `Run` > `createDailyTrigger` to set up the daily trigger.
- This will schedule the script to run automatically at the specified time each day.

## Script Files

- [`main.gs`](#maings): The main Google Apps Script code that performs all the operations.

## Important Notes

- **API Rate Limits**: The script includes delays to handle API rate limits. Ensure your usage complies with the IQAir API terms and conditions.
- **Sensitive Information**: Do not share your API key or any other sensitive information publicly.
- **Email Styling**: The email content uses inline CSS for styling. Some email clients may not support all CSS features.

## License

This project is licensed under the MIT License.

## Contact

For any questions or assistance, please contact the technical support team at [support@example.com](mailto:support@example.com).
