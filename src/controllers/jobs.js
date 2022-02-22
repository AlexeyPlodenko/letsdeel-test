const {Contract, CONTRACT_STATUS} = require("../models/Contract");
const {Op} = require("sequelize");
const {Job} = require("../models/Job");
const {sequelize} = require("../db");
const {d} = require("../helpers");
const {Profile} = require("../models/Profile");

/**
 * Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.getUnpaid = async (req, res) => {
    const jobs = await Job.findAll({
        include: [{
            model: Contract,
            required: true,
        }],
        where: {
            [Op.or]: [
                {'$Contract.ContractorId$': req.profile.id},
                {'$Contract.ClientId$': req.profile.id}
            ],
            '$Contract.status$': CONTRACT_STATUS.IN_PROGRESS,
            paid: null
        },
        order: ['id'],
    });

    return res.json(jobs);
};

/**
 * Pay for a job. A client can only pay if his balance >= the amount to pay.
 * The amount should be moved from the client's balance to the contractor balance.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.pay = async (req, res) => {
    const {jobId} = req.params;

    let job;
    await sequelize.transaction(async (transaction) => {
        // the reason of JOINs and not multiple SELECTs
        // https://stackoverflow.com/questions/1067016/join-queries-vs-multiple-queries

        job = await Job.findOne({
            include: [
                {
                    model: Contract,
                    required: true,
                    include: [
                        {
                            model: Profile,
                            required: true,
                            as: 'Client'
                        },
                        {
                            model: Profile,
                            required: true,
                            as: 'Contractor'
                        }
                    ]
                },
            ],
            where: {
                id: jobId,
                paid: null
            },
        }, { transaction });
        if (!job) {
            return res.status(404).end();
        }
        if (job.Contract.ClientId !== req.profile.id) {
            // only the clients are allowed to pay

            // the 401 status reason - https://stackoverflow.com/a/3547509/3057066
            return res.status(401).json({error: 'You are not a client.'}).end();
        }
        if (job.Contract.Client.balance < job.price) {
            // we need enough money on the account to pay for the job

            return res.status(400).json({error: 'Not enough funds.'}).end();
        }

        // taking money from the Client
        job.Contract.Client.balance -= job.price;
        await job.Contract.Client.save({transaction});

        // and putting them to the Contractor's balance
        job.Contract.Contractor.balance += job.price;
        await job.Contract.Contractor.save({transaction});

        // marking the job as paid
        job.paid = 1;
        job.paymentDate = new Date();
        await job.save({transaction});
    })

    return res.json(job);
};
