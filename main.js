const cheerio = require("cheerio");
const request = require("request-promise");
var fs = require("fs");
var cron = require("node-cron");

cron.schedule("*/10 * * * * *", () => {
  console.log("running a task ");
  fs.readFile("data_content.txt", "utf8", (err, arrs) => {
    const arr = arrs.split("\n");
    for (let i = 0; i < 1; i++) {
      fs.readFile("log_content.txt", "utf8", (err, datas) => {
        if (err) throw err;
        if (datas.includes(arr[i])) {
          arr.splice(i, 1);
          fs.writeFileSync(
            "data_content.txt",
            arr.join("\n"),
            function (err) {}
          );
          return;
        } else {
          request(arr[i], (error, response, html) => {
            if (!error && response.statusCode == 200) {
              console.log(
                "🚀 ~ request ~ response.statusCode:",
                response + " -> " + arr[i]
              );
              const $ = cheerio.load(html);
              $(".jeg_inner_content").each((index, el) => {
                const title = $(el).find(".entry-header h1").text();
                const des = $(el).find(".entry-header h2").text();

                $(el).find("#ftwp-postcontent").find("script").remove();
                $(el).find("#ftwp-postcontent").find("ins").remove();
                $(el).find("#ftwp-postcontent").find(".code-block").remove();
                $(el)
                  .find("#ftwp-postcontent")
                  .find(".jnews_inline_related_post_wrapper")
                  .remove();
                $(el)
                  .find("#ftwp-postcontent")
                  .find("#ftwp-container-outer")
                  .remove();
                $("h2").removeClass();
                $("h3").removeClass();
                $("div").removeClass();
                $("a").removeClass();
                $("article").removeClass();
                $("figure").removeClass();
                $("img").removeClass();
                $("i").removeClass();
                $("figcaption").removeClass();

                $("div").removeAttr("data-unique");
                $("h2").removeAttr("id");
                $("h3").removeAttr("id");
                $("figcaption").removeAttr("id");
                $("figure").removeAttr("id");
                $("figure").removeAttr("aria-describedby");

                const content = $(el).find("#ftwp-postcontent").html();

                fs.readFile("data.json", "utf8", (err, String) => {
                  if (err) {
                    console.log("File read failed:", err);
                    return;
                  }
                  jsonString = JSON.parse(String);
                  jsonString.push({
                    title: title,
                    des: des,
                    content: content,
                  });
                  fs.writeFileSync(
                    "data.json",
                    JSON.stringify(
                      jsonString,
                      null,
                      2,
                      (err) => err && console.error(err)
                    )
                  );
                });
                fs.writeFileSync("log_content.txt", arr[i] + "\n", {
                  flag: "a+",
                });
              });
            } else {
              console.log(error);
            }
          });
        }
      });
    }
  });
});
