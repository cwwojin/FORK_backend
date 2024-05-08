/* ~/middleware/validator.js */
const { validationResult } = require("express-validator");


module.exports = {
    validatorChecker: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
};