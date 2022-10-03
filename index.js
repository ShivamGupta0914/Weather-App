const http = require('http');

const fs = require('fs'); 

var requests = require('requests');

const homeFile = fs.readFileSync("home.html" , "utf-8");

const replaceVal=(tempval,orgVal)=>{

    let temperature=tempval.replace("{%tempval%}", (orgVal.main.temp-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmin%}", (orgVal.main.temp_min-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmax%}", (orgVal.main.temp_max-273.15).toFixed(2));
    temperature=temperature.replace("{%location%}", orgVal.name);
    temperature=temperature.replace("{%country%}", orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res)=>{

    if(req="/"){
         requests('https://api.openweathermap.org/data/2.5/weather?q=dubai&appid=5f2aed037283d95d4d2d0d89700e06fc').on('data',  (chunk) => {

        const objData = JSON.parse(chunk);

        const arrData = [objData];

       const realTimeData = arrData
       .map((val)=>replaceVal(homeFile,val))
       .join("");

       res.write(realTimeData);
        })

        .on('end',  (err) => {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        console.log('end'); 
        });
    }
}); 
server.listen(8000 , "127.0.0.1");