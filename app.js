var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Here I import the cors module
const cors = require("cors");
// Here I import the helmet module
const helmet = require("helmet");

var serverRouter = require("./routes/server");

var app = express();

// This port variable specifies the port address for the server
const PORT = process.env.PORT || 8080;

// Code for Heroku
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "front-end/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
  });
}
app.use(express.static(path.join(__dirname, "front-end/build")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Here I use cors and helmet with middleware
app.use(cors());
app.use(helmet());

app.use("/api", serverRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// The back-end runs on port 8080
app.listen(PORT);

module.exports = app;
