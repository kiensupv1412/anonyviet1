const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request-promise");
var fs = require("fs");
const path = require("path");
var cron = require("node-cron");

// request(
//   "https://anonyviet.com/tut-doc-latat-may-tinh-bang-cach-vuot-man-hinh",
//   (error, response, html) => {
//     if (!error && response.statusCode == 200) {
//       const $ = cheerio.load(html);
//       let data = [];
//       $(".jeg_inner_content").each((index, el) => {
//         const title = $(el).find(".entry-header h1").text();
//         const des = $(el).find(".entry-header h2").text();

//         $(el).find("#ftwp-postcontent").find("script").remove();
//         $(el).find("#ftwp-postcontent").find("ins").remove();
//         $(el).find("#ftwp-postcontent").find(".code-block").remove();
//         $(el).find("#ftwp-postcontent").find(".jnews_inline_related_post_wrapper").remove();
//         $(el).find("#ftwp-postcontent").find("#ftwp-container-outer").remove();
//         $("h2").removeClass();
//         $("h3").removeClass();
//         $("div").removeClass();
//         $("a").removeClass();
//         $("article").removeClass();
//         $("figure").removeClass();
//         $("img").removeClass();
//         $("i").removeClass();
//         $("figcaption").removeClass();

//         $("div").removeAttr("data-unique");
//         $("h2").removeAttr("id");
//         $("h3").removeAttr("id");
//         $("figcaption").removeAttr("id");
//         $("figure").removeAttr("id");
//         $("figure").removeAttr("aria-describedby");

//         const content = $(el).find("#ftwp-postcontent").html();

//         data.push({
//           title,
//           des,
//           content,
//         }); // đẩy dữ liệu vào biến data
//       });
//       fs.writeFileSync("data.json", JSON.stringify(data)); // lưu dữ liệu vào file data.json
//     } else {
//       console.log(error);
//     }
//   }
// );
cron.schedule("40 1 * * * *", () => {
  console.log("running a task wait 40s");

  fs.readFile("data.txt", "utf8", (err, data) => {
    if (err) throw err;
    const arr = data.split("\n");
    let fileName;
    let pathFile;

    for (let i = 0; i < 20; i++) {
      fs.readFile("log.txt", "utf8", (err, data) => {
        if (err) throw err;
        if (data.includes(arr[i])) {
          console.log("Da ton tai file nay -> " + arr[i]);
          arr.splice(i, 1);
          fs.writeFileSync("data.txt", arr.join("\n"), function (err) {});
          return;
        } else {
          const arrpath = arr[i].split("/").reverse();
          pathFile = "image/" + arrpath[2] + "/" + arrpath[1];
          fileName = arrpath[0];
          request
            .get(arr[i])
            .on("error", function (err) {
              console.log(err);
            })
            .on("response", function (response) {
              console.log(
                response.statusCode +
                  " -> " +
                  response.statusMessage +
                  " -> " +
                  arr[i]
              );
              fs.writeFileSync(
                "log.txt",
                arr[i] + "\n",
                { flag: "a+" },
                function (err) {
                  if (err) throw err;
                }
              );
              if (response.statusCode === 404) {
                console.log("File not found");
              }
            })
            .pipe(fs.createWriteStream(`./${pathFile}/` + fileName));
        }
      });
    }
  });
});

// tao toan bo folder
// fs.readFile("img.txt", "utf8", (err, data) => {
//   if (err) throw err;
//   const arr = data.split("\n");
//   arr.forEach((item) => {
//     const arrpath = item.split("/").reverse();
//     const path = "image/" + arrpath[2] + "/" + arrpath[1];
//     fs.mkdirSync(path, { recursive: true });
//   });
// });
