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
      {url: "https://moto-app-qk7f.onrender.com",}
      // { url: "http://localhost:5000" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;