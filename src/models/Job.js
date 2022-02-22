const {sequelize} = require("../db");
const Sequelize = require("sequelize");

class Job extends Sequelize.Model {
}

Job.init(
    {
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
        },
        ContractId: {
            type: Sequelize.INTEGER
        }
    },
    {
        sequelize,
        modelName: 'Job',
        indexes: [
            {
                fields: ['paid']
            },
            {
                fields: ['ContractId']
            },
        ]
    }
);

module.exports = {
    Job
};