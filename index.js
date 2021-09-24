#!/usr/bin/env node
const mdLinks = require("./script");
const fnPrintInfor = require("./printinfo.js");

let option = { validate: false, stats: false };

switch (process.argv[3]) {
  case "--validate":
    option.validate = true;
    if (process.argv[4] == "--stats") {
      option.stats = true;
    }
    mdLinks(process.argv[2], option).then((message) => {
      fnPrintInfor(message, option);
    });
    break;
  case "--stats":
    option.stats = true;
    if (process.argv[4] == "--validate") {
      option.validate = true;
    }
    mdLinks(process.argv[2], option).then((message) => {
      fnPrintInfor(message, option);
    });
    break;
  case undefined:
    mdLinks(process.argv[2], option).then((message) => {
      fnPrintInfor(message, option);
    });
    break;
  default:
    console.log("comando no valido");
}
