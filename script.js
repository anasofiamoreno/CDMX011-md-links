module.exports = function mdLinks(path, options) {
  return new Promise((resolve1, reject1) => {
    var XMLHttpRequest = require("xhr2");
    let readline = require("readline");
    let fs = require("fs");
    let listUrls = [];
    let contListUrls = 0;
    let lines = [];
    let numLinea = 1;
    let response = [];
    let lineURL = "error";
    let textToSend = "<No Text>";

    let lector = readline.createInterface({
      input: fs.createReadStream(path),
    });

    lector
      .on("line", (line) => {
        lines.push(line);
      })
      .on("close", () => {
        fnValite(lines).then((message) => {
          resolve1(message);
        });
      });

    function fnValite(linesToEvaluate) {
      return new Promise((resolve2, reject2) => {
        linesToEvaluate.map((element, i) => {
          if (element.includes("https")) {
            let urlObtained = element
              .slice(element.indexOf("https"))
              .split(")");

            const text = element.slice(element.indexOf("[") + 1).split("]");
            listUrls.push([urlObtained[0], i + 1, text[0]]);
            let infoOfLink = new Object();
            infoOfLink = { url: urlObtained[0], line: i + 1, text: text[0] };
            let request = new XMLHttpRequest();
            request.open("HEAD", urlObtained[0], true);
            request.onreadystatechange = function (e) {
              if (request.readyState == 4) {
                contListUrls++;
                let statusIsValid = new String();
                if (request.status >= 200 && request.status <= 399) {
                  statusIsValid = "ok";
                } else {
                  statusIsValid = "fail";
                }

                if (options.validate) {
                  response.push({
                    href: request._url.href,
                    text: infoOfLink.text,
                    file: path,
                    status: request.status,
                    ok: statusIsValid,
                    line: infoOfLink.line,
                  });
                } else {
                  response.push({
                    href: request._url.href,
                    text: infoOfLink.text,
                    file: path,
                    line: infoOfLink.line,
                  });
                }

                if (contListUrls == listUrls.length) {
                  resolve2(response);
                }
              }
            };
            request.send(null);
          }
          numLinea++;
        });
      });
    }
  });
};
