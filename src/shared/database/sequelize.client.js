import { Sequelize } from 'sequelize';
import path from 'path';

import { NODE_ENV } from '../../configs/environment/environment.config.js';
import { loadJSON } from '../utils/load-json.util.js';

const configPath = path.resolve('src/configs/database/database.config.json');  // Correct the path
const config = loadJSON(configPath);

export const sequelize = new Sequelize({
  dialect: config[NODE_ENV].dialect,
  storage: config[NODE_ENV].storage,
  logging: config[NODE_ENV].logging === 'true' ? console.log : false,  // Fix the logging option
});

