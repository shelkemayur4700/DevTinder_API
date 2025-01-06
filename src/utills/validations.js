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
const validateProfileEditData = (req) => {
  const allowedEditProfileFields = [
    "emailId",
    "skills",
    "about",
    "profileURL",
    "age",
    "gender",
  ];
  const isallowed = Object.keys(req.body).every((d) =>
    allowedEditProfileFields.includes(d)
  );
  return isallowed;
};
module.exports = { validateSignUpData, validateProfileEditData };
