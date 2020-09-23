const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Fav_Relationships = loader.database.define('fav_relationships', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
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
  ]
});

module.exports = Fav_Relationships;