# TINOAIRE Air Quality Report Generator

This script generates an air quality report based on data from the IQAir API and sends it via email. It also includes functionality to schedule report generation at specific times daily.

## Prerequisites

Before using this script, make sure you have the following:

- Python 3.x installed
- Required Python packages installed (you can install them using `pip`):
  - `csv`
  - `requests`
  - `time`
  - `yagmail`
  - `pandas`
  - `openpyxl`

## Usage

1. Set your IQAir API key in the `API_KEY` variable.
2. Prepare a CSV file named `locations.csv` containing the locations' names, latitudes, and longitudes. The file should have the following format:

LocationName, Latitude, Longitude
```
- Location1, 12.3456, -78.9012
- Location2, 34.5678, -56.7890
```

You can also omit the location name and provide only latitude and longitude if not needed.

3. Run the script by executing `python main.py` in your terminal.

## Report Generation

The script generates an air quality report for each location listed in `locations.csv`. The report includes the following information:

- Location Name
- Latitude
- Longitude
- AQI (Air Quality Index) for the location
- Main pollutant for the location
- Health recommendations based on the AQI

The report is saved in `history.csv`, and a modified version with colored AQI cells is saved in `modified_history.xlsx`.

## Email Configuration

The script sends the report via email using yagmail. Configure your Gmail credentials in the script by setting your email address and password:

```python
email_address = "your_email@gmail.com"
password = "your_password"
```
Additionally, specify the recipient's email address:
```
to = "recipient@example.com"
```
## Report Schedule
The script is set to generate reports at 7:00 a.m. and 12:00 p.m. daily. You can adjust the schedule by modifying the following lines:

# Schedule report generation at 7:00 a.m. and 12:00 p.m. every day
```
schedule.every().day.at("07:00").do(send_report)
schedule.every().day.at("12:00").do(send_report)
```
## Running in the Background
The script runs the report generation process in the background using a separate thread. It ensures that scheduled reports are generated even if the script is not actively running.

To start the script and initiate the background thread, run the script as the main module:

```
if __name__ == "__main__":
    scheduler_thread = threading.Thread(target=run_schedule)
    scheduler_thread.start()
```

## Metrics and Legend
The script calculates the Air Quality Index (AQI) for each location and assigns a color code based on the EPA's AQI categories. Here's a breakdown of the AQI metrics and the corresponding legend:

- Green Flag (0 to 50 - Good): The air quality is considered satisfactory, and there is minimal to no risk from air pollution.

- Yellow Flag (51 to 100 - Moderate): The air quality is acceptable, but there may be moderate health concerns for exceptionally sensitive people.

- Orange Flag (101 to 150 - Unhealthy for Sensitive Groups): Members of sensitive groups may experience health effects. It is not likely to affect the general public.

- Red Flag (151 to 200 - Unhealthy): Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.

- Purple Flag (201 to 300 - Very Unhealthy): Health alert: everyone may experience more serious health effects.

- Maroon Flag (301 and above - Hazardous): Health warning of emergency conditions. The entire population is more likely to be affected.

These color-coded flags provide a quick visual reference for the air quality level in each location, making it easier to interpret the report.

## How the Final Report Looks
The final report is sent as an email in HTML format with an embedded header image. It includes the following sections:

- Header: The report begins with a header image for branding.

- Title: An informative title introducing the air quality report for children under 5 years old, based on the EPA's Air Quality Index.

- Disclaimer: A disclaimer stating that the email is automated and should not be replied to.

- Introduction: A brief introduction, addressing the recipient and explaining the purpose of the report.

- EPA Recommendations: Information on where to find additional details about the EPA's air quality metrics and recommendations.

- Testing Phase: A note indicating that the report is part of a testing phase and mentions the data source.

- Legend: The legend section, which explains the color-coded AQI flags and their meanings.

- Report Data: The main report data, including location-specific AQI values, main pollutants, and health recommendations.

- Attachment: The complete report is attached in an Excel file named "modified_history.xlsx."

- Closing Message: A closing message expressing gratitude for the recipient's commitment to children's safety and well-being.

- The report is designed to provide valuable information about air quality while maintaining a professional and informative format.

## Sources
IQAir API: https://api-docs.iqair.com/
EPA Air Quality Index: https://www.epa.gov/air-research



