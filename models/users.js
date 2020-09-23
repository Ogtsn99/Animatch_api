const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const expressJwt = require('express-jwt')

const User = loader.database.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    twitter_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    profile: {
        type: Sequelize.STRING(510)
    }
}, {
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['id']
        },
        {
            fields: ['twitter_id']
        }
    ]
});

User.findCurrentUser = (req, res, next)=>{
    expressJwt({
        secret: 'my-secret',
        requestProperty: 'auth',
        algorithms: ['HS256'],
        getToken: function(req) {
            if (req.headers['x-auth-token']) {
                return req.headers['x-auth-token'];
            }
            return null;
        }
    });

    if(req.auth){
        User.findByPk(req.auth.id).then(user => {
            if (user) res.send({user: user})
            else res.send({user: null, message: "No user found."})
        })
    }else res.send({user: null, message: "No user found."})
}

module.exports = User;