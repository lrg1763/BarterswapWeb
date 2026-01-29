/**
 * Swagger/OpenAPI конфигурация
 */

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Barterswap API',
      version: '1.0.0',
      description: 'API для платформы обмена навыками Barterswap',
      contact: {
        name: 'Barterswap Support',
        email: 'support@barterswap.com',
      },
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./app/api/**/*.ts'],
}

module.exports = swaggerConfig
