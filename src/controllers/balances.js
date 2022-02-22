const {QueryTypes} = require("sequelize");
const {sequelize} = require("../db");

/**
 * Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay.
 * (at the deposit moment)
 * @TODO And if there are no jobs for this client at all? 0 EUR * 25% = 0. Can this client still deposit and how much?
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.deposit = async (req, res) => {
    const {deposit} = req.body;
    const profileId = req.profile.id;

    await sequelize.transaction(async (transaction) => {
        const jobs = await sequelize.query(
            `SELECT SUM(price) AS priceTotal
            FROM Jobs AS j
            JOIN Contracts AS c ON j.ContractId = c.id
            WHERE j.paid IS NULL AND c.ClientId = :profileId`,
            {
                type: QueryTypes.SELECT,
                transaction,
                replacements: {
                    profileId
                },
                plain: true
            }
        );
        const maxDepositAllowed = jobs.priceTotal * 0.25;

        if (deposit > maxDepositAllowed) {
            // 25% deposit threshold reached

            return res
                    .status(400).
                    json({error: `Deposit is too high. Your max. one time deposit is ${maxDepositAllowed}.`})
                    .end();
        }

        // we cannot use the req.profile model, as it is not in the transaction and the balance could change
        await sequelize.query(
            `UPDATE Profiles
            SET balance = balance + :deposit
            WHERE id = :profileId`,
            {
                type: QueryTypes.UPDATE,
                transaction,
                replacements: {
                    deposit,
                    profileId
                },
            }
        );
    });

    return res.json({success: true});
};
