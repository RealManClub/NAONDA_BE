"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const findPi = (latitude, longitude, y, x) => {
    return Math.sqrt(Math.abs(latitude - y) * Math.abs(latitude - y) +
        Math.abs(longitude - x) * Math.abs(longitude - x));
};
const chPoopAndCalc = (myY, myX, poopY, poopX) => {
    const R = 6371e3; //지구의반지름
    //좌표를 라디안 단위로 변환
    const chMyY = (myY * Math.PI) / 180;
    const chPoopY = (poopY * Math.PI) / 180;
    const chLamda = ((poopX - myX) * Math.PI) / 180;
    //거리식
    const d = Math.acos(Math.sin(chMyY) * Math.sin(chPoopY) +
        Math.cos(chMyY) * Math.cos(chPoopY) * Math.cos(chLamda)) * R;
    return d;
};
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let myWichY = Number(req.query.Y);
    let myWichX = Number(req.query.X);
    let findC = 0;
    let z = 10000000;
    const jsonFile = fs_1.default.readFileSync("db.json", "utf8");
    const jsonData = JSON.parse(jsonFile);
    let fsPoop;
    for (let i = 0; i < jsonData.DATA.length; i++) {
        findC = findPi(myWichY, myWichX, Number(jsonData.DATA[i].y_wgs84), Number(jsonData.DATA[i].x_wgs84));
        if (z > findC) {
            z = findC;
            fsPoop = jsonData.DATA[i];
        }
    }
    // res.send(typeof(Number(jsonData.DATA[12].x_wgs84)));
    res.send(fsPoop);
}));
app.listen(8080, () => {
    console.log("Server is Listening on Port 3000!");
    //haren-dev.defcon.or.kr 도메인은 이 서버의 3000 포트다....
    //8080포트는 이 VSCode가 돌아가고 있는 포트다...
});
