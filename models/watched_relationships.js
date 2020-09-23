'use strict';
const loader = require('./sequelize-loader')
const Sequelize = loader.Sequelize

const Watched_Relationship = loader.database.define('watched_relationships', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  anime_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      fields: ['anime_id', 'user_id']
    }
  ]})

module.exports = Watched_Relationship