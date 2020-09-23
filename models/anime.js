'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Anime = loader.database.define('anime', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    company: {
        type: Sequelize.STRING
    },
    broad: {
        type: Sequelize.STRING
    },
    number_of_episodes: {
        type: Sequelize.STRING
    },
    begin_date: {
        type: Sequelize.DATEONLY
    },
    end_date: {
        type: Sequelize.DATEONLY
    },
    status: {
        type: Sequelize.STRING
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

module.exports = Anime;