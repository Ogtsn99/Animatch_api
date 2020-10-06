const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const User = require('../models/users')

const UserInfo = loader.database.define('user_info', {
  profile: {
    type: Sequelize.STRING(510)
  },
  twitter_id_str: {
    type: Sequelize.STRING(25)
  },
  age: {
    type: Sequelize.INTEGER
  },
  gender: {
    type: Sequelize.STRING(10)
  },
  user_id: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      fields: ['id']
    }
  ]
});


module.exports = UserInfo