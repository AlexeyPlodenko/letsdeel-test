const {Profile} = require("../models/Profile");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<*>}
 */
exports.getProfile = async (req, res, next) => {
    const profileId = req.get('profile_id');
    if (!profileId) {
        return res.status(422).end();
    }

    const profile = await Profile.findOne({
        where: {id: profileId}
    });
    if (!profile) {
        return res.status(401).end();
    }

    req.profile = profile;

    next();
};
