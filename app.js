import express from 'express';
import bodyParser from 'body-parser';
import path, { parse } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const first = req.body.fname;
    const last = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "shiana:9225af237b8e16c9f0a838725f7b3c25-us10"
    };

    const request = https.request('https://us10.api.mailchimp.com/3.0/lists/99ecd2ae39', options, function(response){
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});

//9225af237b8e16c9f0a838725f7b3c25-us10

//99ecd2ae39