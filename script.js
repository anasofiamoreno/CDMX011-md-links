module.exports = function mdLinks (path, options) {
  return new Promise( (resolve1, reject1) => {
    var XMLHttpRequest = require('xhr2');
  let readline = require('readline');
  let fs  = require('fs');
  let listUrls = [];
  let contListUrls = 0;
  let lines = [];
  let numLinea = 1;
  let response = [];
  
 /*
  fs.readFile(path, 'utf-8', (err, data) => {fnReadReady(data)});
  
  function fnReadReady(data, error){
    console.log(data);
    let ss = fs.createReadStream(path);
    console.log(ss.on());
  }
  */

  let lector = readline.createInterface({
    input: fs.createReadStream(path),
  });

  lector.on('line',line => {
    lines.push(line)
  }).on('close', () => {
    fnValite(lines)
    .then((message) => {resolve1(message)})
  });

  function fnValite(linesToEvaluate){
    return new Promise( (resolve2,reject2) => {
      linesToEvaluate.map( (element) => {
        if(element.includes('https')){
          //console.log('linea ' + numLinea, element);
          const ss = element.slice(element.indexOf('https')).split(')')
          //console.log('Url:',ss[0]);
          listUrls.push(ss[0]);
          //request.addEventListener('load',function() {console.log(request.status, request._url.href)});
          let request = new XMLHttpRequest();
          request.open('HEAD', ss[0], true);
          request.onreadystatechange = function (e) {
            if(request.readyState == 4){
              contListUrls++;
              //console.log('yes', request.status, request._url.href);
              let ok = new String;
              if(request.status == 200){
                ok = 'ok';
              }
              else{
                ok = 'fail';
              }

              if(options.validate){
                response.push({href:request._url.href, text: "empty", file: path, status:request.status, ok: ok});
              }
              else{
                response.push({href:request._url.href, text: "empty", file: path});
              }
              
              //console.log(contListUrls);
              //console.log(listUrls.length);
              if(contListUrls == listUrls.length ){
                resolve2(response);
              }
              
              
            }
            
          }
          request.send(null)
        }
        numLinea++;
      });
    });
  }

  })
  
};

