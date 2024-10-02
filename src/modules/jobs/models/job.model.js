import { Sequelize } from 'sequelize';

import { sequelize } from '../../../shared/database/sequelize.client.js';
import { Contract } from '../../contracts/models/contract.model.js';
import { Profile } from '../../admin/models/profile.model.js';

export const Job = sequelize.define('Job', {
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  paid: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  paymentDate: {
    type: Sequelize.DATE
  }
});

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);