export function parser(str) {
  let parsObj = {};
  str = str.replace(/ /g, "");
  let params = str.split("),");

  parsObj.len = params.length;
  parsObj.args = [];

  params.forEach((element, ind) => {
    let arg = {};
    let param = element.split("(");
    arg.name = param[0];
    arg.args = param[1].replace(")", "").split(",");
    if (arg.args[0][0] === "f") {
      arg.size = Number(arg.args[0].replace("f", ""));
    }
    parsObj.args.push(arg);
  });
  return parsObj;
}
