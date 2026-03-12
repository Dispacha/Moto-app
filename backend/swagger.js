const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Moto Client",
      version: "1.0.0",
      description: "API de mise en relation client et moto-taximan"
    },
    servers: [
      {
        url: "http://localhost:5000" // URL de ton serveur backend
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"] // chemin vers tes fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;