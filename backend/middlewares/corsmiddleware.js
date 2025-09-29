const cors = require("cors");

async function corsConnect(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:3000"]; // add your allowed origins here

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  next();
}

module.exports = corsConnect;
