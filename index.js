
import { Readable } from "stream";
const readableStream = await fetch(
  'https://652c15ec.cloudflareinterntest.pages.dev/'
  ).then((r) => Readable.fromWeb(r.body));
readableStream
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
