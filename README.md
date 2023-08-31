
# Resumen Integrado del Proyecto del TinoAire para Monitoreo de Calidad del Aire en Centros Educativos con Enfoque en Menores de 5 Años

---

## Objetivo

Desarrollar un bot en Python que utilice la Air Quality API de Google Cloud para monitorear la calidad del aire en localidades preestablecidas de centros educativos enfocados en participantes menores de 5 años. El bot generará alertas basadas en métricas fiables, clasificadas en tres banderas de colores: verde, amarillo y rojo. Se enviará un informe consolidado vía correo electrónico para su evaluación.

---

## Componentes Clave

1. **API de Google Cloud - Air Quality**: Fuente de datos para la calidad del aire.
2. **Coordenadas Preestablecidas**: Lista de localidades geográficas de centros educativos.
3. **Métricas de Evaluación**: Parámetros específicos de calidad del aire que serán evaluados, con un enfoque en la seguridad de niños menores de 5 años. (Detalles más abajo).
4. **Sistema de Alertas**: Bandera verde: Calidad del aire aceptable. Bandera amarilla: Calidad del aire moderada, se necesita revisión. Bandera roja: Calidad del aire peligrosa, servicio no disponible.
5. **Informe Consolidado**: Resumen de los hallazgos para cada localidad, generado en un formato fácil de leer.
6. **Envío de Correo Electrónico**: Distribución del informe para su evaluación.

---

## Métricas de Evaluación para Participantes Menores de 5 Años

#### 1. PM2.5 (Partículas Menores a 2.5 Micrómetros)

- **Bandera Verde**: < 12 µg/m³
- **Bandera Amarilla**: 12-35 µg/m³
- **Bandera Roja**: > 35 µg/m³
- **Fuente**: [EPA](https://www.epa.gov/pm-pollution/particulate-matter-pm-basics)

##### Aplicación en Menores de 5 Años
Las partículas PM2.5 son extremadamente pequeñas y pueden penetrar profundamente en los pulmones y hasta llegar al torrente sanguíneo. Los niños menores de 5 años tienen sistemas respiratorios en desarrollo y son más susceptibles a la irritación y las infecciones respiratorias causadas por estas partículas.

---

#### 2. PM10 (Partículas Menores a 10 Micrómetros)

- **Bandera Verde**: < 20 µg/m³
- **Bandera Amarilla**: 20-50 µg/m³
- **Bandera Roja**: > 50 µg/m³
- **Fuente**: [EPA](https://www.epa.gov/pm-pollution/particulate-matter-pm-basics)

##### Aplicación en Menores de 5 Años
Aunque las partículas PM10 son más grandes que las PM2.5, también pueden ser inhaladas y llegar a los pulmones. Pueden causar problemas respiratorios y agravar condiciones preexistentes como el asma en niños menores de 5 años.

---

#### 3. Dióxido de Nitrógeno (NO2)

- **Bandera Verde**: < 25 ppb
- **Bandera Amarilla**: 25-45 ppb
- **Bandera Roja**: > 45 ppb
- **Fuente**: [EPA](https://www.epa.gov/no2-pollution/basic-information-about-no2)

##### Aplicación en Menores de 5 Años
La exposición al NO2 puede irritar las vías respiratorias y contribuir al desarrollo de infecciones respiratorias en niños menores de 5 años. También puede agravar condiciones preexistentes como el asma.

---

#### 4. Ozono (O3)

- **Bandera Verde**: < 40 ppb
- **Bandera Amarilla**: 40-70 ppb
- **Bandera Roja**: > 70 ppb
- **Fuente**: [EPA](https://www.epa.gov/ozone-pollution)

##### Aplicación en Menores de 5 Años
El ozono es un irritante pulmonar que puede afectar a los niños menores de 5 años, ya que sus sistemas respiratorios todavía están en desarrollo. Puede provocar síntomas como tos, dolor de garganta y reducción de la función pulmonar.

---

#### 5. Monóxido de Carbono (CO)

- **Bandera Verde**: < 1 ppm
- **Bandera Amarilla**: 1-2 ppm
- **Bandera Roja**: > 2 ppm
- **Fuente**: [EPA](https://www.epa.gov/co-pollution)

##### Aplicación en Menores de 5 Años
El CO es un gas peligroso que puede causar daño a nivel celular debido a la falta de oxígeno. Es especialmente peligroso para los niños menores de 5 años, ya que incluso una pequeña cantidad puede tener efectos graves en su salud debido a su menor capacidad pulmonar y mayor tasa de inhalación en relación con su tamaño.

---

## Flujo de Trabajo

1. **Configuración Inicial**: Credenciales API y bibliotecas.
2. **Obtener Coordenadas**: Leer desde archivo CSV o base de datos.
3. **Consulta a la API**: Iterar sobre cada conjunto de coordenadas.
4. **Evaluación y Clasificación**: Asignar una de las tres banderas basadas en métricas detalladas anteriormente.
5. **Generar Reporte**: Compilar los hallazgos en un archivo (CSV, PDF, etc.).
6. **Envío de Correo**: Utilizar SMTP para enviar el informe por correo electrónico.

---

## Tecnologías a Utilizar

- Python
- Google Cloud Air Quality API
- SMTP para el envío de correos
- CSV o Base de Datos para almacenar coordenadas
