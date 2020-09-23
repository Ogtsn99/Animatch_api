'use strict';
const loader = require('./sequelize-loader')
const Sequelize = loader.Sequelize

const Watching_Relationship = loader.database.define('watching_relationships', {
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
  },
  number_of_watched_episodes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      fields: ['anime_id', 'user_id']
    }
  ]})

module.exports = Watching_Relationship