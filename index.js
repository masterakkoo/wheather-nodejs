const http = require("http");
const fs = require('fs');
const requests = require('request');
const port = 3000;
const hostname = '127.0.0.1';
const ak = fs.readFileSync("./index.html", 'utf-8');

const replaceval = (tempval, orgval) => {
  let temp = tempval.replace("{%tempval%}", ((orgval.main.temp) / 10).toFixed(2));
  temp = temp.replace("{%tempmax%}", ((orgval.main.temp_max) / 10).toFixed(2));
  temp = temp.replace("{%tempmin%}", ((orgval.main.temp_min) / 10).toFixed(2));
  temp = temp.replace("{%tempcountry%}", (orgval.sys.country));
  temp = temp.replace("{%tempcity%}", (orgval.name));
  temp = temp.replace("{%tempstatus%}", (orgval.weather[0].main));
  temp = temp.replace("{%humidity%}", ((orgval.main.humidity) / 10).toFixed(2));
  temp = temp.replace("{%pressure%}", ((orgval.main.pressure) / 10).toFixed(2));
  temp = temp.replace("{%feels%}", ((orgval.main.feels_like) / 10).toFixed(2));
  return temp;
}
const server = http.createServer((req, res) => {

  if (req.url == "/") {
    requests('https://api.openweathermap.org/data/2.5/weather?lat=26.4609135&lon=80.3217588&appid=e4f64de8e424c7d3a49fb685b46ebc1d')
      .on('data', (dat) => {
        const obj1 = JSON.parse(dat);
        const arr = [obj1];
        const real = arr.map(val => replaceval(ak, val)).join("");
        res.write(real);
        console.log(arr);
      })
      .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);

        res.end();
      });
  }
  else {
    res.end("error 404")
  }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});