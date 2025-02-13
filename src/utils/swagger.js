const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const swaggerDir = path.join(__dirname, './swagger');

// Función para cargar todos los archivos JSON de la carpeta swagger/
const loadSwaggerDocs = () => {
    const docs = {
        paths: {},
        components: {
            schemas: {},
            securitySchemes: {}
        }
    };

    const files = fs.readdirSync(swaggerDir);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(swaggerDir, file);
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Combinar paths y components
            Object.assign(docs.paths, jsonData.paths);
            if (jsonData.components) {
                Object.assign(docs.components.schemas, jsonData.components.schemas || {});
                Object.assign(docs.components.securitySchemes, jsonData.components.securitySchemes || {});
            }
        }
    });

    return docs;
};

// Cargar los documentos Swagger desde JSON
const swaggerDocsData = loadSwaggerDocs();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ride Hailing API',
            version: '1.0.0',
            description: 'Documentación de la API de Ride Hailing',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
        paths: swaggerDocsData.paths,
        components: swaggerDocsData.components
    },
    apis: [path.join(__dirname, "../routes/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;

