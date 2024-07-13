import express from "express";
import dbConnection from "./services/Database";
import App from "./services/ExpressApp";
import config from "config";
// import cowsay from "cowsay";
// import figlet from "figlet";
// import chalk from "chalk";

const startServer = async () => {
  const app = express();

  await dbConnection();

  await App(app);
  // // Cow saying hello
  // console.log(
  //   cowsay.say({
  //     text: "Hello, world!",
  //     e: "OO",
  //     T: "U ",
  //     r: true, // Reformat text so it fits inside the speech bubble
  //   })
  // );
  // console.log(
  //   cowsay.think({
  //     text: "Moo!",
  //     e: "OO",
  //     T: "U ",
  //   })
  // );

  // // ASCII art text
  // figlet("Eng. Reham Eid😋", function (err: any, data: any) {
  //   if (err) {
  //     console.log("Something went wrong...");
  //     console.dir(err);
  //     return;
  //   }
  //   console.log(chalk.blue(data));
  // });
  const port = config.get<number>("PORT");
  const host = config.get<string>("HOST");

  const serverListen = app.listen(port, () => {
    console.log(`server run on http://${host}:${port} `);
    console.log(` worker process ID pid= ${process.pid}`);
  });
  /* Handling rejection outside express */
  process.on("unhandledRejection", (error) => {
    throw error;
  });

  /* Handling exception */
  const uncaughtException = (error) => {
    serverListen.close(() => {
      console.error(
        `The server was shut down due to uncaught exception: ${error.message}`
      );
      process.exit(1);
    });
  };

  process.on("uncaughtException", uncaughtException);

  /* Handle process termination signals */
  const shutdown = () => {
    serverListen.close(() => {
      console.log("The server is shutting down...");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();
