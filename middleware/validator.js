const { query, validationResult } = require('express-validator');

module.exports ={
    async checkTokenId (req, res, next) {
        await query('id').isInt().run(req);
        return module.exports.checkParamErrors(req, res, next);
    },

    checkParamErrors(req, res, next) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: errors.array()
            });
        }

        next();
    }
}
