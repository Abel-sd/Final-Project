const { validate } = require("../../models/Auth");

module.exports.register = async (request, response, next) => {
  const { error } = validate(request.body); 
        if (error) return response.status(400).send(error.details[0].message);
        next();
      };

module.exports.login = async (request, response, next) => {
  const { error } = validate(request.body); 
        if (error) return response.status(400).send(error.details[0].message);
        next();
      };