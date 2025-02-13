Proyecto Backend con Node.js, Express y MongoDB

Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalados los siguientes requisitos:

Node.js (versión recomendada: 16 o superior)

MongoDB (puede ser local o un servicio en la nube como MongoDB Atlas)

Git (opcional, para clonar el repositorio)

Instalación

Sigue estos pasos para configurar y ejecutar el backend:

1. Clonar el Repositorio

git clone https://github.com/usuario/back-prueba-ridery.git
cd back-prueba-ridery

2. Instalar Dependencias

npm install

3. Configurar Variables de Entorno

Definir la variable PORT y BASE_URL, emplear el resto de las variables como ya estan definidas

4. Ejecutar el Servidor

Para iniciar el servidor en modo desarrollo con nodemon:

npm start

Para ejecutar en modo producción:

npm start:prod

Endpoints Principales

El backend expone los siguientes endpoints:

GET /api/vehiculos - Listar vehículos

POST /api/vehiculos - Registrar un vehículo

GET /api/usuarios - Listar usuarios

POST /api/auth/login - Autenticación de usuario

Consulta la documentación completa en Swagger cuando el servidor esté en ejecución en la URL_BASE/api-docs

Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
