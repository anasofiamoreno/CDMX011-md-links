module.exports = function mdLinks(path, options) {
  return new Promise((resolveToIndex, rejectToIndex) => {
    var XMLHttpRequest = require("xhr2"); //Import para funcionamiento de XMLHttpRequest
    let readline = require("readline"); //Import para funcionamiento leer lineas de archivos de texto plano en NODE
    let fs = require("fs"); //Import para poder leer archivos de textoplano en NODE
    global.fetch = require('node-fetch-npm').default;



    let listUrls = []; //Array donde se guardan todas las URL encontradas, junto con el texto y numero de linea.
    let contListUrls = 0; //Contador de cada respuestas de servidores.
    let allLines = []; //Array con todas las lineas del archivo .md.
    let response = []; //Objecto con la respuesta de cada solicitud de servidor
    let urlObtained = ""; //String donde se guardan temporalmente laURL de cada linea.
    let textOfUrl = ""; //String donde se guardan temporalmente el texto de cada URL.
    let mdFiles = [];

    if (!path.includes(".md")) {
      let files = fs.readdirSync(path);
      files.forEach((file) => {
        if (file.includes(".md" || ".txt")) {
          mdFiles.push(path +  '/' + file);
        }
      });
    }
    else{
      mdFiles.push(path);
    }

    let lector = [];
    mdFiles.forEach((file) => {
      lector = readline.createInterface({
        input: fs.createReadStream(file),
      });
    });

    
     

    lector //Procesa las lineas y genera un array de lineas para ser analizado en busca de urls.
      .on("line", (line) => {
        allLines.push(line);
      })
      .on("close", () => {
        fnValite(allLines).then((arrayWithObjects) => {
          resolveToIndex(arrayWithObjects);
        });
      });

    function fnValite(linesToEvaluate) {
      return new Promise((resolveMultiHtml, rejectMultiHtml) => {
        linesToEvaluate.map((elementLineToEvaluate, i) => {
          if (elementLineToEvaluate.includes("https://")) {
            urlObtained = elementLineToEvaluate
              .slice(elementLineToEvaluate.indexOf("https://"))
              .split(")");
            textOfUrl = elementLineToEvaluate
              .slice(elementLineToEvaluate.indexOf("[") + 1)
              .split("]");
            listUrls.push([urlObtained[0], i + 1, textOfUrl[0]]);
            let infoOfLink = new Object();
            infoOfLink = {
              url: urlObtained[0],
              line: i + 1,
              text: textOfUrl[0],
            };
            let request = new XMLHttpRequest();
            console.log('Direccion mandada',urlObtained[0])
            request.open("HEAD", urlObtained[0], true);
            request.send(null);

            request.onreadystatechange = function () {
              if (request.readyState == 4) {
                //console.log(request._url);
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
                  resolveMultiHtml(response);
                }
              }
            };
          }
        });
      });
    }
  });
};
