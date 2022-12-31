const dotenv = require("dotenv");
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Error!");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
const connectDB = require("./config/db");
const port = process.env.PORT || 4000;

const server = app.listen(port, async () => {
  console.log(
    `Server is running on http://localhost:${port}`.cyan.underline.bold
  );
  await connectDB();
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Error!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
