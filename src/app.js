import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import { loadJSON } from './shared/utils/load-json.util.js';
import AppError from './shared/errors/app.error.js';
import router from './shared/routes/index.js';

const swaggerFile = loadJSON(`${process.cwd()}/src/swagger.json`);
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(
  (err, request, response, next) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  }
);

export default app;