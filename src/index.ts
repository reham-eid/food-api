import express from "express";
import dbConnection from "./services/Database";
import App from "./services/ExpressApp";
// import cowsay from "cowsay";
// import figlet from "figlet";
// import chalk from "chalk";
const PORT = 8000;

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

  app.listen(PORT, () => {
    console.log(`server run on ${PORT} `);
    console.log(` worker process ID pid= ${process.pid}`);
  });
};

startServer();
