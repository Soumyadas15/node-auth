import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Nodejs auth API',
            version: '1.0.0',
            description: 'A secure & scalabale authentication API made using Node.js',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
            },
        ],
    },
    apis: [
            './src/api/router/auth/*.ts', 
            './src/api/router/auth/oauth/*.ts',
            './src/api/router/student/*.ts',
            './src/api/router/admin/*.ts',
        ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };