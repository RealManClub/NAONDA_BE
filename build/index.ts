import express, { Request, Response, response } from "express";
import fs from "fs";

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const findPi = (latitude: number, longitude: number, y: number, x: number) => {
  return Math.sqrt(
    Math.abs(latitude - y) * Math.abs(latitude - y) +
      Math.abs(longitude - x) * Math.abs(longitude - x)
  );
};
const chPoopAndCalc = (
  myY: number,
  myX: number,
  poopY: number,
  poopX: number
) => {
  const R = 6371e3; //지구의반지름
  //좌표를 라디안 단위로 변환
  const chMyY = (myY * Math.PI) / 180;
  const chPoopY = (poopY * Math.PI) / 180;
  const chLamda = ((poopX - myX) * Math.PI) / 180;

  //거리식
  const d =
    Math.acos(
      Math.sin(chMyY) * Math.sin(chPoopY) +
        Math.cos(chMyY) * Math.cos(chPoopY) * Math.cos(chLamda)
    ) * R;
  return d;
};

app.get("/", async (req: Request, res: Response) => {
  let myWichY: number = Number(req.query.Y);
  let myWichX: number = Number(req.query.X);
  let findC: number = 0;
  let z: number = 10000000;
  const jsonFile = fs.readFileSync("db.json", "utf8");
  const jsonData = JSON.parse(jsonFile);
  
  let fsPoop: any;
  for (let i = 0; i < jsonData.DATA.length; i++) {
    findC = findPi(
      myWichY,
      myWichX,
      Number(jsonData.DATA[i].y_wgs84),
      Number(jsonData.DATA[i].x_wgs84)
    );
    if (z > findC) {
      z = findC;
      fsPoop = jsonData.DATA[i];
    }
  }
  // res.send(typeof(Number(jsonData.DATA[12].x_wgs84)));
  res.send(fsPoop);
});


app.listen(8080, () => {
  console.log("Server is Listening on Port 8080!");
  //haren-dev.defcon.or.kr 도메인은 이 서버의 3000 포트다....
  //8080포트는 이 VSCode가 돌아가고 있는 포트다...
});
