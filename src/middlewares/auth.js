const adminAuth = (req, res, next) => {
  const token = "xyz";
  const Istoken = "xyzsdvsdfv";
  if (Istoken === token) {
    next();
  } else {
    res.status(401).send("uuauthorized user");
  }
};
const userAuth = (req, res, next) => {
  const token = "xyz";
  const Istoken = "xyzsdvsdfv";
  if (Istoken === token) {
    next();
  } else {
    res.status(401).send("uuauthorized user");
  }
};

module.exports = { adminAuth, userAuth };
