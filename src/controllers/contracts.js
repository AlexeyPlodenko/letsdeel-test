const {Contract, CONTRACT_STATUS} = require("../models/Contract");
const {Op} = require("sequelize");

/**
 * Returns contract by its ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.getItem = async (req, res) => {
    const {contractId} = req.params;

    const contract = await Contract.findOne({
        where: {
            id: contractId
        }
    });
    if (!contract) {
        return res.status(404).end();
    }
    if (contract.ContractorId !== req.profile.id && contract.ClientId !== req.profile.id) {
        // the 401 status reason - https://stackoverflow.com/a/3547509/3057066
        return res.status(401).end();
    }

    return res.json(contract);
};

/**
 * Returns a list of contracts belonging to a user (client or contractor),
 * the list should only contain non terminated contracts.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.listAll = async (req, res) => {
    const contracts = await Contract.findAll({
        where: {
            [Op.or]: [
                {ContractorId: req.profile.id},
                {ClientId: req.profile.id}
            ],
            status: {[Op.ne]: CONTRACT_STATUS.TERMINATED}
        },
        order: ['id'],
    });

    return res.json(contracts);
};
