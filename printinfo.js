module.exports = function fnPrintInfo(message, option) {
  let uniques = [];
  let corrects = 0;
  let incorrects = 0;
  let brokenLinks = 0;
  let porcentWorking = 0;

  message.sort((a, b) => {
    if (a.line > b.line) {
      return 1;
    }
    if (a.line < b.line) {
      return -1;
    }

    return 0;
  });

  if (option.stats) {
    process.stdout.write(
      "Total  " + "\033[32m" + message.length + "\033[0m" + "\n"
    );
    uniques = message.map((element) => {
      return element.href.toString();
    });
    uniques = new Set(uniques);
    console.log("Unique", Array.from(uniques).length);
    if (option.validate) {
      brokenLinks = message.filter((element) => {
        if (element.ok == "fail") {
          return element;
        }
      });
      porcentWorking = Math.round(100 - (brokenLinks.length/Array.from(uniques).length) * 100);
      process.stdout.write(
        "Broken " + "\033[31m" + brokenLinks.length + "\033[0m" + "\n"
      );
      process.stdout.write(
        "Working " + '\033[34m' + porcentWorking + '%' + "\033[0m" + "\n"
      );
    }
  } else {
    if (option.validate) {
      corrects = message.filter((element) => {
        if (element.ok == "ok") {
          return element;
        }
      });
      incorrects = message.filter((element) => {
        if (element.ok == "fail") {
          return element;
        }
      });
      corrects.forEach((element) => {
        process.stdout.write(
          "line " +
            element.line +
            " " +
            "\033[32m" +
            element.file +
            " " +
            "\x1b[0m" +
            "\x1b[4m" +
            element.href +
            "\x1b[0m" +
            "\x1b[37m" +
            " " +
            "\033[32m" +
            element.ok +
            " " +
            "\x1b[33m" +
            element.status +
            " " +
            "\x1b[0m" +
            element.text.slice(0, 30) +
            "\n"
        );
      });
      incorrects.forEach((element) => {
        process.stdout.write(
          "line " +
            element.line +
            " " +
            "\033[31m" +
            element.file +
            " " +
            "\x1b[0m" +
            "\x1b[4m" +
            element.href +
            "\x1b[0m" +
            "\x1b[37m" +
            " " +
            "\033[31m" +
            element.ok +
            " " +
            "\x1b[33m" +
            element.status +
            " " +
            "\x1b[0m" +
            element.text.slice(0, 30) +
            "\n"
        );
      });
    } else {
      message.forEach((element) => {
        console.log(
          "Line",
          element.line,
          element.file,
          "\033[36m" + element.href + "\033[0m",
          element.text.slice(0, 30)
        );
      });
    }
  }
  process.exit();
};
