// check username, psw in port(login) request
// if exist create new JWT
// send back to FE

// setup authentication so only the request with JWT can access the dashboard

const jwt = require("jsonwebtoken");
const CustomApiError = require("../errors/custom-error");
const CustomAPIError = require("../errors/custom-error");

const login = async (req, res) => {
  const { username, password } = req.body;

  // mongo
  // Joi
  //  check in the controller
  if (!username || !password) {
    throw new CustomApiError("Please provide email and password", 400);
  }

  // just for demo, normally provided by DB
  const id = new Date().getTime();

  // try to keep payload small, better experience for user
  // (key) just for demo, in production use long(256-bit-secret), complex unguessable string value!!!!

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //console.log(username, password);
  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  //console.log(req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  //console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hi ${decoded.username}`,
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
    });
  } catch (error) {
    throw new CustomAPIError("Not authorized to access this route", 401);
  }
};

module.exports = { login, dashboard };
