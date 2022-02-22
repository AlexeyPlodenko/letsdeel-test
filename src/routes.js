const {param, body, query} = require('express-validator');

const {getProfile} = require("./middleware/getProfile");
const contractsController = require("./controllers/contracts");
const jobsController = require("./controllers/jobs");
const balancesController = require("./controllers/balances");
const adminController = require("./controllers/admin");
const app = require("./app");
const {handleValidation} = require("./middleware/handleValidation");

/**
 * Let's be polite and welcome guests. But lazy enough, not to create a separate controller.
 */
app.get('/', (req, res) => {
    return res.json({message: 'Hi!'});
});

// Contracts --------------------------------
app.get(
    '/contracts/:contractId',
    param('contractId').isInt({min: 1}),
    handleValidation,
    getProfile,
    contractsController.getItem
);
app.get('/contracts', getProfile, contractsController.listAll);

// Jobs --------------------------------------
app.get('/jobs/unpaid', getProfile, jobsController.getUnpaid);
app.post(
    '/jobs/:jobId/pay',
    param('jobId').isInt({min: 1}),
    handleValidation,
    getProfile,
    jobsController.pay
);

// Balances ------------------------------------
// @TODO Why do we need :userId in the route, if we supply profile_id in the headers? o_O Should one client be able to deposit to another one's account? I have assumed no.
app.post(
    '/balances/deposit',
    body('deposit').isFloat({min: 1}),
    handleValidation,
    getProfile,
    balancesController.deposit
);

// Admin ---------------------------------------
app.get(
    '/admin/best-profession',
    query('start').optional().isISO8601(),
    query('end').optional().isISO8601(),
    handleValidation,
    adminController.bestProfession
);
app.get(
    '/admin/best-clients',
    query('start').optional().isISO8601(),
    query('end').optional().isISO8601(),
    query('limit').optional().isInt({min: 1}),
    handleValidation,
    adminController.bestClients
);
