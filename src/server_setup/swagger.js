const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('@src/config');
const constant = require('@src/constant');
const path = require('path');

module.exports = (app) => {
  if (config.NODE_ENV !== constant.PRODUCTION) {
    const swaggerDefinitionV1 = {
      swaggerDefinition: {
        info: {
          title: 'REST API for My Demo Application',
          version: '1.0.0',
          description: 'This is the REST API for My Demo Application'
        },
        host: `${config.SWAGGER_BASE_URL}:${config.APP_PORT}`,
        basePath: '/api/'
      },
      explorer: true,
      apis: [path.join(__dirname, '..', 'api', 'swagger_docs', '*.yaml')]
    };

    const swaggerSpecV1 = swaggerJSDoc(swaggerDefinitionV1);

    const swaggerHtmlV1 = swaggerUi.generateHTML(swaggerSpecV1);
    app.use('/docs', swaggerUi.serveFiles(swaggerSpecV1));
    app.get('/docs', (req, res) => {
      res.send(swaggerHtmlV1);
    });
  }
};
