#!/usr/bin/env node
let mdLinks = require('./script');
let option = 0;

switch(process.argv[3]){
    case '--validate': option = { validate: true };
    break;
    default: option = { validate: false };
}

mdLinks(process.argv[2], option)
  .then( (message) => {
      //console.log(message);
      if(option.validate){
        message.forEach(element => {
          console.log(element.file, element.href, element.ok, element.status, element.text);
        });
      }
      else{
        message.forEach(element => {
          console.log(element.file, element.href, element.text);
        });
      }
      
  });
