var XLSX = require('xlsx'); 
var workbook = XLSX.readFile('public\\DataTest.xlsx');
var sheet_name_list = workbook.SheetNames;
var jsonObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
// console.log(jsonObj);
// console.log(jsonObj[0].Col1);
jsonObj.forEach(function(val, ind){
    console.log(val.Col1 + " - " + ind);
    val.Col1 += "??";
    console.log(val.Col1 + " - " + ind);
});