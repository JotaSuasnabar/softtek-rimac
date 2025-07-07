Proyecto Serverless: Fusión de Personajes (Star Wars & Pokémon) y Gestión de Datos

Construcción de una API serverless robusta y escalable utilizando AWS Lambda y Amazon DynamoDB, orquestada con Serverless Framework. La aplicación permite la fusión de datos de personajes de Star Wars y Pokémon, el almacenamiento de información personalizada y la consulta de un historial de fusiones.


☁️ Servicios AWS Utilizados
AWS Lambda: Funciones de cómputo sin servidor para la lógica de negocio de cada endpoint.

Amazon DynamoDB: Base de datos NoSQL de alto rendimiento para el almacenamiento de datos transaccionales, historial y caché.

Amazon API Gateway: Servicio para crear, publicar, mantener, monitorear y asegurar APIs RESTful para las funciones Lambda.


🚀 Arquitectura y Tecnologías
Frameworks:

Serverless Framework: Herramienta CLI para el despliegue y gestión de la infraestructura serverless como código (IaC).

Node.js: Entorno de ejecución para las funciones Lambda.

Lenguajes de Programación:

TypeScript: Lenguaje de programación tipado que mejora la mantenibilidad y escalabilidad del código.

Herramientas de Optimización:

powerTuningStateMachine: Una máquina de estados de AWS Step Functions para testear y analizar el consumo de memoria y el tiempo óptimo de ejecución para cada función Lambda.


🗄️ Almacenamiento de Datos (DynamoDB)
El proyecto utiliza tres tablas DynamoDB principales, configuradas con PAY_PER_REQUEST para optimizar costos:

FusionHistoryTable: Almacena el historial de personajes fusionados. Incluye un índice secundario global (ChronologicalIndex) para consultas paginadas y ordenadas por fecha.

CustomDataTable: Destinada al almacenamiento de datos personalizados definidos por el usuario.

ApiCacheTable: Implementa un mecanismo de caché para las llamadas a APIs externas. Configurada con TTL (Time-To-Live) para la expiración automática de los elementos después de 30 minutos, optimizando la frescura de los datos y el uso de recursos.


🌐 Endpoints de la API
La API está expuesta a través de API Gateway en la URL base: https://e2b1u1b55i.execute-api.us-east-1.amazonaws.com

GET /fusionados

Descripción: Fusiona un personaje aleatorio de Star Wars con un Pokémon aleatorio. Almacena el resultado en el historial de fusiones.

URL: https://e2b1u1b55i.execute-api.us-east-1.amazonaws.com/fusionados


POST /almacenar

Descripción: Permite almacenar una estructura de datos personalizada en la CustomDataTable.

URL: https://e2b1u1b55i.execute-api.us-east-1.amazonaws.com/almacenar

Cuerpo de la Solicitud (JSON):

{
  "nombre": "Jose Suasnabar",
  "prioridad": "alta",
  "valor": 100
}


GET /historial

Descripción: Recupera una lista paginada de personajes fusionados previamente almacenados.

URL: https://e2b1u1b55i.execute-api.us-east-1.amazonaws.com/historial

Parámetros de Consulta:

limit: Número máximo de elementos a devolver (ej., ?limit=10).

nextToken: Token de paginación para obtener la siguiente página de resultados (ej., &nextToken=<token>).


🧪 Pruebas
Pruebas Unitarias y de Integración:

Jest: Framework de pruebas utilizado para la ejecución de tests.

Ejecución: npm test


🚀 Despliegue
El despliegue de la aplicación en AWS se realiza de manera eficiente utilizando Serverless Framework.

Comando de Despliegue: serverless deploy

