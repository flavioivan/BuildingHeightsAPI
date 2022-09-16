const Joi = require('joi');  // For input validation

const validate = (input) => {
    try {
        const schema = Joi.object({
            building_limits: { type: Joi.string().required(), coordinates: Joi.any() },
            height_plateaus: { type: Joi.string().required(), coordinates: Joi.any(), height: Joi.number().required() }
        })
        const validationResult = schema.validate(input);
        if (validationResult.error != undefined) {
            return validationResult.error.details[0].message;
        }
    } catch (error) {
        return error.message;
    }

    // empty error message means success!
    return null;
};

module.exports = validate;