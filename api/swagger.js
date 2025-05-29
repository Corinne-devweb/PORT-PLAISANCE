const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API du Port de Russell",
      version: "1.0.0",
      description:
        "Documentation de l'API pour la gestion des catways, utilisateurs et réservations",
    },
    servers: [
      {
        url: "http://localhost:4010", // à adapter selon ton environnement
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Important pour Swagger UI
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Appliqué globalement à toutes les routes sauf exceptions
      },
    ],
  },
  apis: [
    "./routes/*.js", // Routes avec endpoints
    "./middleware/*.js", // Middlewares (si commentaires Swagger présents)
    "./services/*.js", // Services (si commentaires Swagger présents)
    "./models/*.js", // Modèles avec définitions de schémas
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
