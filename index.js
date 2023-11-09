const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('general_data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    for(let i = 0; i < results.length; i++){

    }
   
  });






/*
const { parse } = require("csv-parse");
const fs = require("fs");

fs.createReadStream("general_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    console.log(data);
  })
  .on("error", (error) => {
    console.log(error);
  })
  .on("end", () => {
    console.log("Done");
  });
  */