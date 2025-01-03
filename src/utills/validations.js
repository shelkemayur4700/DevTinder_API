const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter valid name");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid Eamil");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter valid password");
  }
};

module.exports = { validateSignUpData };
