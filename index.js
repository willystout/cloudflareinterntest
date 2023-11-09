const requestUrl = "https://cloudflareinterntest.pages.dev/";
fetch(requestUrl)
.then(response => response.json())
.then(data => { 
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
})