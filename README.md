# Proyecto Serverless: Fusión de Personajes (Star Wars & Pokémon) y Gestión de Datos

Este proyecto implementa una **API serverless robusta y escalable** utilizando AWS Lambda y Amazon DynamoDB, orquestada con **Serverless Framework**. La aplicación fusiona datos de personajes de Star Wars y Pokémon, permite almacenar información personalizada y consultar un historial de fusiones.

---

## ☁️ Servicios AWS Utilizados

- **AWS Lambda**
- **Amazon DynamoDB**
- **Amazon API Gateway**

---

## 🚀 Arquitectura y Tecnologías

### Frameworks
- **Serverless Framework**: Despliegue y gestión de infraestructura como código (IaC).
- **Node.js**: Entorno de ejecución para las funciones.

### Lenguajes de Programación
- **TypeScript**: Mejora de mantenibilidad y escalabilidad del código.

### Herramientas de Optimización
- **powerTuningStateMachine**: Análisis de consumo de memoria y rendimiento de funciones Lambda con AWS Step Functions.

---

## 🗄️ Almacenamiento de Datos (DynamoDB)

El proyecto utiliza tres tablas principales, configuradas con `PAY_PER_REQUEST`:

- **FusionHistoryTable**: Guarda el historial de fusiones. Incluye un GSI (ChronologicalIndex) para consultas paginadas y ordenadas por fecha.
- **CustomDataTable**: Almacena estructuras de datos personalizadas.
- **ApiCacheTable**: Implementa caché con TTL de 30 minutos para optimizar llamadas a APIs externas.

---

## 🌐 Endpoints de la API

**Base URL:** `https://e2b1u1b55i.execute-api.us-east-1.amazonaws.com`

### `GET /fusionados`
- **Descripción**: Fusiona un personaje aleatorio de Star Wars con un Pokémon aleatorio y guarda el resultado.
- **URL**: `/fusionados`

### `POST /almacenar`
- **Descripción**: Guarda datos personalizados definidos por el usuario.
- **URL**: `/almacenar`
- **Body (JSON)**:
  ```json
  {
    "nombre": "Jose Suasnabar",
    "prioridad": "alta",
    "valor": 100
  }
  ```

### `GET /historial`
- **Descripción**: Recupera una lista paginada de fusiones almacenadas.
- **URL**: `/historial`
- **Query Params**:
  - `limit`: Número máximo de elementos (ej: `?limit=10`)
  - `nextToken`: Token para obtener la siguiente página (ej: `&nextToken=`)

---

## 🧪 Pruebas

### Framework
- **Jest**: Utilizado para pruebas unitarias y de integración.

### Ejecución
```bash
npm test
```

---

## 🚀 Despliegue

El despliegue en AWS se realiza con Serverless Framework:

```bash
serverless deploy
```

---

Desarrollado por Jose Suasnabar © 2025

