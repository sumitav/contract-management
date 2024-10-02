import { Sequelize } from 'sequelize';

import { sequelize } from '../../../shared/database/sequelize.client.js';

export const Contract = sequelize.define('Contract', {
  terms: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('new', 'in_progress', 'terminated')
  }
});