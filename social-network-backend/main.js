require("dotenv").config();
//#region express configures
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("client-sessions");
const DButils = require("./routes/utils/DButils");
const { userIdFromRequest } = require("./routes/utils/auth_token");
var cors = require('cors')

var app = express();
app.set("trust proxy", 1);
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
const corsConfig = {
  origin: true,
  credentials: true
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    req.connection.proxySecure = true;
    const setHeader = res.setHeader.bind(res);
    res.setHeader = (name, value) => {
      if (String(name).toLowerCase() === "set-cookie") {
        const addSameSiteNone = (cookie) => {
          if (cookie.includes("SameSite=") || cookie.includes("samesite=")) {
            return cookie;
          }
          return `${cookie}; SameSite=None; Secure`;
        };
        value = Array.isArray(value)
          ? value.map(addSameSiteNone)
          : addSameSiteNone(String(value));
      }
      return setHeader(name, value);
    };
  }
  next();
});
app.use(
  session({
    cookieName: "session", // the cookie key name
    //secret: process.env.COOKIE_SECRET, // the encryption key
    secret: "template", // the encryption key
    duration: 24 * 60 * 60 * 1000, // expired after 20 sec
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration,
    cookie: {
      httpOnly: false,
      sameSite: process.env.NODE_ENV === "production" ? false : "lax",
      secure: process.env.NODE_ENV === "production",
    }
    //the session will be extended by activeDuration milliseconds
  })
);
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files
app.get("/", function(req, res) {
  res.send({ message: "Recipes API is running", alive: true });
});

var port = process.env.PORT || "80"; //local=3000 remote=80
//#endregion
const user = require("./routes/user");
const recipes = require("./routes/recipes");
const auth = require("./routes/auth");


//#region cookie middleware
app.use(function (req, res, next) {
  const userId = (req.session && req.session.user_id) || userIdFromRequest(req);
  if (userId) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === userId)) {
          req.user_id = userId;
        }
        next();
      })
      .catch((error) => next());
  } else {
    next();
  }
});
//#endregion

// ----> For cheking that our server is alive
app.get("/alive", (req, res) => res.send("I'm alive"));

// Routings
app.use("/users", user);
app.use("/recipes", recipes);
app.use(auth);

// Default router
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});



const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});

module.exports = app;
