const {QueryTypes} = require("sequelize");
const {sequelize} = require("../db");
const {d} = require("../helpers");

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor
 * that worked in the query time range.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.bestProfession = async (req, res) => {
    const queryReplacements = {}

    let queryPaymentDateStart;
    if (req.query.start) {
        queryReplacements.dateStart = req.query.start;
        queryPaymentDateStart = 'AND j.paymentDate >= :dateStart';
    } else {
        queryPaymentDateStart = '';
    }

    let queryPaymentDateEnd;
    if (req.query.end) {
        queryReplacements.endDate = req.query.end;
        queryPaymentDateEnd = 'AND j.paymentDate <= :endDate';
    } else {
        queryPaymentDateEnd = '';
    }

    const bestProfession = await sequelize.query(
        `SELECT p.profession
        FROM Jobs AS j
        JOIN Contracts AS c ON c.id = j.ContractId
        JOIN Profiles AS p ON p.id = c.ContractorId
        WHERE j.paid IS NOT NULL ${queryPaymentDateStart} ${queryPaymentDateEnd}
        GROUP BY p.profession
        ORDER BY SUM(j.price) DESC
        LIMIT 1`,
        {
            type: QueryTypes.SELECT,
            replacements: queryReplacements,
            plain: true
        }
    );

    return res.json({
        bestProfession: bestProfession ? bestProfession.profession : null
    });
};

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor
 * that worked in the query time range.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.bestClients = async(req, res) => {
    const defaultLimit = 2;
    const queryReplacements = {
        limit: req.query.limit ? req.query.limit : defaultLimit
    }

    let queryPaymentDateStart;
    if (req.query.start) {
        queryReplacements.dateStart = req.query.start;
        queryPaymentDateStart = 'AND j.paymentDate >= :dateStart';
    } else {
        queryPaymentDateStart = '';
    }

    let queryPaymentDateEnd;
    if (req.query.end) {
        queryReplacements.endDate = req.query.end;
        queryPaymentDateEnd = 'AND j.paymentDate <= :endDate';
    } else {
        queryPaymentDateEnd = '';
    }

    const bestProfessions = await sequelize.query(
        `SELECT p.profession
        FROM Jobs AS j
        JOIN Contracts AS c ON c.id = j.ContractId
        JOIN Profiles AS p ON p.id = c.ClientId
        WHERE j.paid IS NOT NULL ${queryPaymentDateStart} ${queryPaymentDateEnd}
        GROUP BY p.profession
        ORDER BY SUM(j.price) DESC
        LIMIT :limit`,
        {
            type: QueryTypes.SELECT,
            replacements: queryReplacements
        }
    );

    return res.json({
        bestProfessions: bestProfessions.map(row => row.profession)
    });
};

