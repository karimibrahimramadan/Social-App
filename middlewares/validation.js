const dataMethods = ["params", "file", "headers", "body", "query"];

const validation = (schema) => {
  return (req, res, next) => {
    const validationErrArr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErrArr.push(validationResult.error.details);
        }
      }
    });
    if (validationErrArr.length) {
      return res.status(400).json({
        status: "Fail",
        message: "Validation error",
        error: validationErrArr,
      });
    } else {
      next();
    }
  };
};

module.exports = validation;
