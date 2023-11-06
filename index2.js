const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// 下载每一章节
async function handleText(url, isFirst) {
  const resp = await axios(url);
  const $ = cheerio.load(resp.data);
  const bookName = $("#r-titlePage > div > h1").text();

  // 章节名称
  const chapterName = $(
    "#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > h1"
  ).text();

  let content = [];

  let nextChapterLink = "";
  if (isFirst) {
    content.push(bookName);
    // nextChapterLink = $(
    //   "#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.mx-64px.pb-64px.mt-auto > div > a:nth-child()"
    // ).attr("href");
  } else {
    // nextChapterLink = $(
    //   "#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.mx-64px.pb-64px.mt-auto > div > a:nth-child(3)"
    // ).attr("href");
  }
  nextChapterLink = $(
    "#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.mx-64px.pb-64px.mt-auto > div > a:nth-child(3)"
  ).attr("href");

  content.push(chapterName);
  // if (!nextChapterLink) {
  //   nextChapterLink = $(
  //     "#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.mx-64px.pb-64px.mt-auto > div > a:nth-child(3)"
  //   ).attr("href");
  //   console.log("nextChapterLink11111", nextChapterLink);
  // }

  $("main")
    .find("p")
    .each((idx, ele) => {
      content.push($(ele).text());
    });

  content.push("\f");
  // $("p").each((idx, ele) => {
  //   content.push($(ele).text());
  // });

  content = content.join("\n");
  return { title: bookName, chapterName, content, nextChapterLink };
}

async function createFile(bookName) {
  let filename = `${bookName}.txt`;

  return new Promise((resolve) => {
    fs.open(filename, "w", function (err, file) {
      if (err) throw err;
      // console.log("File is created successfully.");
      resolve("success");
    });
  });
}

async function writeFile(bookName, content) {
  let filename = `${bookName}.txt`;

  return new Promise((resolve) => {
    fs.appendFile(filename, content, function (err) {
      if (err) throw err;
      // console.log("Content has been added!");
      resolve("success");
    });
  });
}

// handleText(url);

async function downloadBook(url) {
  let nextUrl = url;
  let isFirst = true;
  let bookName = "";
  console.log("下载开始...");
  while (nextUrl) {
    const { title, chapterName, content, nextChapterLink } = await handleText(
      nextUrl,
      isFirst
    );
    // console.log(title, content);
    console.log(chapterName);
    nextUrl = nextChapterLink;

    if (isFirst) {
      bookName = title;
      await createFile(bookName);
    }
    await writeFile(bookName, content);
    isFirst = false;
  }
  console.log("下载完成");

  // console.log(title, chapterName, content, nextChapterLink);
  // 下一章
}

// const url = `https://www.qidian.com/chapter/1025990049/651697912/`;
// const url = `https://www.qidian.com/chapter/2952453/47370768/`;
downloadBook(url);
