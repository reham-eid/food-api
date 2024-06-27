"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Database_1 = __importDefault(require("./services/Database"));
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
// import cowsay from "cowsay";
// import figlet from "figlet";
// import chalk from "chalk";
const PORT = 8000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    yield (0, Database_1.default)();
    yield (0, ExpressApp_1.default)(app);
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
});
startServer();
//# sourceMappingURL=index.js.map