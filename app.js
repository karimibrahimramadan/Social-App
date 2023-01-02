const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("colors");
const helmet = require("helmet");
const routesController = require("./routes/routesController");
const errorHandler = require("./controllers/errorController");
const path = require("path");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");

const app = express();
const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  legaceHeaders: false,
  standardHeaders: true,
  message: "Too many requests from this IP. Please try again in an hour!",
});

// middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api/v1", limiter);
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());

// routes
app.use("/api/v1/comments", routesController.commentRouter);
app.use("/api/v1/posts", routesController.postRouter);
app.use("/api/v1/users", routesController.userRouter);

app.use(errorHandler);

module.exports = app;
