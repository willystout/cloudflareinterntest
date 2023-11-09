// 1) Fetch data from remote API
async function getUsers() {
  try {
    const response = await fetch(event.request, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
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

/*
import { Readable } from "stream";
const Response = await fetch(
  'https://652c15ec.cloudflareinterntest.pages.dev/'
  ).then((r) => Readable.fromWeb(r.body));
Response
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
