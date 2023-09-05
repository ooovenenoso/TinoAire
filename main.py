import csv
import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

# Carga las credenciales para OAuth
credentials = service_account.Credentials.from_service_account_file(
    'credentials.json',
    scopes=['https://www.googleapis.com/auth/cloud-platform']
)

# Función para obtener datos de calidad del aire
def fetch_air_quality_data(lat, lon, credentials):
    if not credentials.valid:
        credentials.refresh(Request())
        
    headers = {
        'Authorization': f'Bearer {credentials.token}',
        'Content-Type': 'application/json'
    }
    
    API_ENDPOINT = "https://airquality.googleapis.com/v1/currentConditions:lookup"
    
    payload = {
        'location': {
            'latitude': lat,
            'longitude': lon
        },
        'extra_computations': [
            "DOMINANT_POLLUTANT_CONCENTRATION",
            "POLLUTANT_CONCENTRATION"
        ]
    }

    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch air quality data: {response.content}")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Leer archivo de ubicaciones
with open('locations.csv', mode='r') as infile:
    reader = csv.reader(infile)
    next(reader, None)  # Saltar la primera fila (encabezado)
    
    # Escribir archivo de historial
    with open('history.csv', mode='w', newline='') as outfile:
        fieldnames = ['Localidad', 'Latitude', 'Longitude', 'Universal AQI', 'Dominant Pollutant', 'PM2.5', 'PM10', 'NO2', 'O3', 'CO']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for row in reader:
            localidad, lat, lon = row
            data = fetch_air_quality_data(float(lat), float(lon), credentials)
            
            if data:
                pollutants_data = {p['code']: p['concentration']['value'] for p in data.get('pollutants', [])}
                
                writer.writerow({
                    'Localidad': localidad,
                    'Latitude': lat,
                    'Longitude': lon,
                    'Universal AQI': data['indexes'][0]['aqi'] if data.get('indexes') else 'N/A',
                    'Dominant Pollutant': data['indexes'][0]['dominantPollutant'] if data.get('indexes') else 'N/A',
                    'PM2.5': pollutants_data.get('pm25', 'N/A'),
                    'PM10': pollutants_data.get('pm10', 'N/A'),
                    'NO2': pollutants_data.get('no2', 'N/A'),
                    'O3': pollutants_data.get('o3', 'N/A'),
                    'CO': pollutants_data.get('co', 'N/A')
                })
