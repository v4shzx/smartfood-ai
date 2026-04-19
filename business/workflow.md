
# Contexto
SmartFood AI es una plataforma de suscripcion (SaaS) que cuenta con 3 vistas principales. 

1) LandinPage : Aqui se describe el proyecto , precios , tecnologias usadas , formualrio de contacto , acceso al login
2) Login : Conexion real a una base de datos
3) Dashboard : Una vez autorizado el login el dashboard muestra un panel lateral con todas las herramientas las cuales estaran disponibles dependiendo del tipo de suscripcion de la cuenta. 

# Tipo de Suscripcion 
## Basico 
- Precio : $0 MXN / mes 
- Herramientas desbloqueadas : Inicio , Registro de Ventas , Graficas , Reportes

## Profesional
- Precio : $299 MXN / mes  
- Herramientas desbloqueadas : Todas las del panel pero limitado a una sola sucursal

## Empresarial 
- Precio : $899 MXN / mes 
- Herramientas desbloqueadas : Todas las del panel  con la oportunidad de controlar diferentes sucursales

# Accesibilidad
Toda la plataforma debe de contar Siempre con los botones de cambio de tema y cambio de idioma en la barra superior (se herada en las vistas) y un boton de accesiblidad (ubicado en la parte inferior derecha del contenido visual)

# Herramientas en la barra de dashboard

## Analisis de Tendencias
- Funcion principal : Predicción de Demanda con Machine Learning (Regresión) , recomendacion de stock 
- Librerias de sugerencia = Pandas, Prophet, Scikit-learn


## Prediccion 
Funcion principal : Analiza variables como el día de la semana, si es festivo, y los datos del clima (temperatura/lluvia) para predecir cuántas raciones se venderán. Prediccion de pico de hora de maxima demanda , oportunidad de merma 




