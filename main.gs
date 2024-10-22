// Sensitive variables (replace with your actual values)
var API_KEY = 'YOUR_IQAIR_API_KEY';
var TO_EMAIL = 'recipient@example.com';

// Spreadsheet ID (optional if the script is bound to the sheet)
var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// Time zone of San Juan, Puerto Rico (GMT-4)
var TIME_ZONE = 'America/Puerto_Rico';

// Main function that runs daily
function sendDailyReport() {
  try {
    var dataRows = [];
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var locationIndex = headers.indexOf('Location');
    var latitudeIndex = headers.indexOf('Latitude');
    var longitudeIndex = headers.indexOf('Longitude');

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var location = row[locationIndex] || 'N/A';
      var lat = row[latitudeIndex];
      var lon = row[longitudeIndex];

      if (!lat || !lon) {
        Logger.log('Skipping invalid row: ' + row);
        continue;
      }

      // Fetch data from the API with retry handling
      var airData = fetchAirQualityData(lat, lon);
      if (airData) {
        var currentData = airData['data']['current'];
        var pollutionData = currentData['pollution'];
        var aqi_us = pollutionData['aqius'];
        var main_us = pollutionData['mainus'];

        var recommendations = getHealthRecommendations(aqi_us);

        dataRows.push({
          'Location': location,
          'Latitude': lat,
          'Longitude': lon,
          'AQI_US': aqi_us,
          'Main Pollutant US': main_us,
          'Recommendations': recommendations
        });
      } else {
        Logger.log('Failed to fetch data for location: ' + location);
      }

      // Pause of 15 seconds between requests
      Utilities.sleep(15000);
    }

    // Check if data was obtained
    if (dataRows.length === 0) {
      Logger.log('No data retrieved. The report will not be sent.');
      return;
    }

    // Generate HTML table
    var htmlTable = generateHtmlTable(dataRows);

    // Generate and send the email
    sendEmail(htmlTable);

    Logger.log('Report sent successfully.');

  } catch (e) {
    Logger.log('An error occurred in sendDailyReport: ' + e);
  }
}

// Function to fetch air quality data with retry handling
function fetchAirQualityData(lat, lon, attempt) {
  attempt = attempt || 1; // Current attempt, default is 1
  var maxAttempts = 5; // Maximum number of retries
  var API_ENDPOINT = 'https://api.airvisual.com/v2/nearest_city?lat=' + lat + '&lon=' + lon + '&key=' + API_KEY;
  try {
    var response = UrlFetchApp.fetch(API_ENDPOINT, { muteHttpExceptions: true });
    var responseCode = response.getResponseCode();
    if (responseCode === 200) {
      return JSON.parse(response.getContentText());
    } else {
      // Log the full response for diagnosis
      Logger.log('HTTP Error ' + responseCode + ': ' + response.getContentText());
      if (responseCode === 429) {
        if (attempt <= maxAttempts) {
          var waitTime = 15000; // Wait for 15 seconds
          Logger.log('HTTP Error 429: Too Many Requests. Waiting ' + (waitTime / 1000) + ' seconds before retrying. Attempt ' + attempt + ' of ' + maxAttempts);
          Utilities.sleep(waitTime); // Wait before retrying
          return fetchAirQualityData(lat, lon, attempt + 1); // Retry
        } else {
          Logger.log('Maximum number of retries reached for ' + lat + ', ' + lon);
          return null;
        }
      } else if (responseCode === 403) {
        Logger.log('HTTP Error 403: Forbidden. Check that your API key is correct and that you have permissions to access this resource.');
        return null;
      } else {
        return null;
      }
    }
  } catch (err) {
    Logger.log('An error occurred: ' + err);
    return null;
  }
}

// Function to get health recommendations based on AQI
function getHealthRecommendations(aqi) {
  if (aqi <= 50) {
    return 'Air quality is satisfactory. Minimal risk.';
  } else if (aqi <= 100) {
    return 'Air quality is acceptable. Some pollutants may pose a moderate health concern for a small number of sensitive people.';
  } else if (aqi <= 150) {
    return 'Members of sensitive groups may experience health effects. General public is less likely to be affected.';
  } else if (aqi <= 200) {
    return 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
  } else if (aqi <= 300) {
    return 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
  } else {
    return 'Health alert: everyone may experience more serious health effects.';
  }
}

// Function to get the corresponding color for the AQI
function getAqiColor(aqiValue) {
  if (aqiValue <= 50) {
    return '#00FF00'; // Green
  } else if (aqiValue <= 100) {
    return '#FFFF00'; // Yellow
  } else if (aqiValue <= 150) {
    return '#FFA500'; // Orange
  } else if (aqiValue <= 200) {
    return '#FF0000'; // Red
  } else if (aqiValue <= 300) {
    return '#800080'; // Purple
  } else {
    return '#800000'; // Maroon
  }
}

// Function to generate the HTML table
function generateHtmlTable(dataRows) {
  var html = `
  <table>
    <tr>
      ${Object.keys(dataRows[0]).map(header => `<th>${header}</th>`).join('')}
    </tr>
    ${dataRows.map((row, index) => {
      var color = getAqiColor(row['AQI_US']);
      return `
      <tr style="${index % 2 === 0 ? 'background-color: #f8f8f8;' : ''}">
        ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
      </tr>
      `;
    }).join('')}
  </table>
  `;
  return html;
}

// Function to send the email
function sendEmail(htmlTable) {
  var currentDate = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd');
  var subject = 'Air Quality Report with EPA Metrics - ' + currentDate;

  var message = `
  <html>
  <head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333333;
      line-height: 1.6;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 28px;
      color: #2E7D32;
      border-bottom: 2px solid #2E7D32;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h2 {
      font-size: 22px;
      margin-top: 25px;
      color: #1565C0;
    }
    p {
      margin: 0 0 15px 0;
    }
    a {
      color: #1E88E5;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    a:hover {
      color: #0D47A1;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #777777;
      text-align: center;
      border-top: 1px solid #dddddd;
      padding-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 20px 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    th, td {
      border: none;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #2E7D32;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f8f8f8;
    }
    tr:hover {
      background-color: #e8f5e9;
    }
    .highlight {
      background-color: #FFF9C4;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
  </head>
  <body>
  <div class="container">
    <h1>Air Quality Report for the Health and Safety Area</h1>
    <p><em>An analysis based on the U.S. EPA Air Quality Index (AQI).</em></p>
    <p>Health and Safety Team,</p>
    <p>This is an automatically generated email to share the Air Quality Report, which is based on the Air Quality Index (AQI) from the United States Environmental Protection Agency (EPA). Our organization is committed to the health and well-being of everyone, and this report aims to provide crucial information about the air quality in our locations.</p>
    
    <h2>EPA Recommendations</h2>
    <p>For additional details on metrics and specific EPA recommendations, please visit the following link: <a href="https://www.epa.gov/air-research">EPA Air Quality Metrics and Sources</a></p>
    
    <div class="highlight">
      <h2>Testing Phase</h2>
      <p>This report is part of our testing phase, where we use air quality data provided by the AirVisual sensors closest to the geographic coordinates of our locations. This allows us to continually evaluate and improve the quality of our reports.</p>
    </div>
    
    <h2>Report Data</h2>
    ${htmlTable}
    
    <p>If you have any questions or need additional assistance, please do not hesitate to contact our technical support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
    
    <div class="footer">
      <p><strong>This is an automatic message. Please do not reply.</strong></p>
    </div>
  </div>
  </body>
  </html>
  `;

  MailApp.sendEmail({
    to: TO_EMAIL,
    subject: subject,
    htmlBody: message
  });
}

// Function to create a daily trigger at 8:00 AM San Juan time
function createDailyTrigger() {
  // Delete any existing triggers to avoid duplicates
  deleteTriggers('sendDailyReport');

  // Create a new trigger
  ScriptApp.newTrigger('sendDailyReport')
    .timeBased()
    .inTimezone(TIME_ZONE)
    .atHour(8)
    .nearMinute(0)
    .everyDays(1)
    .create();

  Logger.log('Daily trigger created for 8:00 AM San Juan time.');
}

// Function to delete existing triggers for a specific function
function deleteTriggers(functionName) {
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
  }
}
