var request    = require('request');
var fs         = require('fs');
var express    = require('express');
var timeFormat = require('./timeFormat.js');
var baseUrl    = 'http://smartisian.club:5000/topten';

var app = express();

app.get('/', function(req, res) {
    res.send('Yes');
});

app.listen(process.env.PORT || 5050, function() {
  console.log("listen at port 5050");
});

var s         = setInterval(function() {
    var now   = new Date();
    var s_now = timeFormat(now);
    var flag;

    fs.readFile(s_now + '.txt', 'utf8', function(err, data) {
        if(err) {
            console.error('读取文件 ' + s_now + '.txt 错误');
            flag = false;
           // return;
        } else {
            flag = true;
            console.log('读取文件 ' + s_now + '.txt 成功');
            var o_data = JSON.parse(data);
            var s_link = "";
            for(var i = 0; i < o_data.length; i++) {
                s_link += o_data[i].link;
            }
        }
        // dont't request when between 00:00 and 01:00

        if(now.getHours() === 0) {
            return;
        }

        request({
            url: baseUrl,
            json: true,
            headers: {
                'User-Agent': 'request'
            }
        }, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                if(body !== undefined) {
                    var result = JSON.stringify(body);
                    if(flag) {
                        for(var i = 0; i < body.length; i++) {
                            if(s_link.indexOf(body[i].link) !== -1) {
                                console.log('当前十大第' + (i + 1) + '个已存在');
                            } else {
                                console.log('当前十大第' + (i + 1) + '个为新发现：' + body[i].link);
                                // insert new found topic
                                o_data.push(body[i]);
                            }
                        }
                    }
                    console.log("数据写入中...");
                    fs.writeFile(s_now + ".txt", result, function(err) {
                        if(err) {
                            console.error('数据写入失败！');
                            console.error(err);
                            return;
                        }
                        if(flag) {
                            console.log('数据更新成功！');
                        } else {
                            console.log('数据写入成功');
                        }
                    });
                }
            }
        });
    });
}, 3000);
