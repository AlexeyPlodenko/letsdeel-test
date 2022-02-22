const Sequelize = require("sequelize");
const {sequelize} = require("../db");

const CONTRACT_STATUS = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    TERMINATED: 'terminated'
};

class Contract extends Sequelize.Model {
}

Contract.init(
    {
        terms: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM(CONTRACT_STATUS.NEW, CONTRACT_STATUS.IN_PROGRESS, CONTRACT_STATUS.TERMINATED)
        },
        ClientId: {
            type: Sequelize.INTEGER
        },
        ContractorId: {
            type: Sequelize.INTEGER
        }
    },
    {
        sequelize,
        modelName: 'Contract',
        indexes: [
            {
                fields: ['status']
            },
            {
                fields: ['ClientId']
            },
            {
                fields: ['ContractorId']
            },
        ]
    }
);

module.exports = {
    Contract,
    CONTRACT_STATUS
};