var express = require('express');
var router = express.Router();
var url = require('url');
var querystring = require('querystring');

var mysql = require("mysql");

var client = mysql.createConnection({
    host : process.env.RDS_HOSTNAME, port: process.env.RDS_PORT,  user:process.env.RDS_USERNAME, password:process.env.RDS_PASSWORD, database:process.env.RDS_DB_NAME
    // host : "localhost", port: 3306,  user:"root", password:"1234", database:"dito_db"

});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.floor(Math.random() * possible.length)));

    return text;
}


/* GET home page. */
router.get('/', function(req, res, next) {
    client.connect(function(err) {
        if (err) {
            res.send(process.env.RDS_HOSTNAME);
            console.error('Database connection failed: ' + err.stack);
            return;
        }

        res.send('Connected to database.');
    });
});

router.get('/login', function (req,res) {


    client.query("SELECT * FROM User where kakao_code='" + req.query.id+"';", function (err, result, fields) {
        if (err) {
            res.send("SELECT * FROM User where kakao_code='" + req.query.id+"';");
            console.log("쿼리문에 오류가 있습니다.");
        }
        else {
            req.session.user_id = req.query.id;
            req.session.name = 'a';
            if(req.session.count)
                req.session.count++;
            else
                req.session.count = 1;
            res.json(result);
        }
    });
});

router.get('/join', function (req,res) {
    client.query("INSERT INTO User values('" + req.query.id+"' , '"+ req.query.name +"' , '"+ req.query.val+"');", function (err, result, fields) {
        if (err) {
            res.send("INSERT INTO User values('" + req.query.id+"' , '"+ req.query.name +"' , '"+ req.query.val+"');");
            console.log("쿼리문에 오류가 있습니다.");
            console.log("INSERT INTO user values('" + req.query.id+"' , '"+ req.query.name +"');");
        }
        else {
            res.send('access');
        }
    });
});

//team 만들기
router.get('/create', function (req,res) {

    console.log(req.session.user_id);
    var random = makeid();
    client.query("INSERT INTO teamroom values('" +random +"' , '"+ req.query.name +"','"+ 0+"');", function (err, result, fields) {
        if (err) {
            res.send('false');
            console.log("쿼리문에 오류가 있습니다.");
        }
        else {
            res.send('access');
        }
    });
    //return code
});

//과제 만들기
router.get('/create/assign', function (req,res) {
    client.query("INSERT INTO teamassignment values('" +1 +"' , '"+ 2 +"','"+ 0+"','"+0+"',"+1+");", function (err, result, fields) {
        if (err) {
            res.send('false');
            console.log("쿼리문에 오류가 있습니다.");
        }
        else {
            res.send('access');
        }
    });
});

//team list
router.get('/get', function (req,res) {
    console.log(req.session.count);
    res.send('get teamlist');

});

//선택한 팀
router.get('/get/team', function (req,res) {
    res.send('get team');

});

//과제 목록
router.get('/get/team/assign', function (req,res) {
    res.send('get assi');

});

//선택한 과제
router.get('/get/assign', function (req,res) {
    res.send('select assi');
});

module.exports = router;