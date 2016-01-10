var fs = require('fs');

fs.readFile('./2016-01-08.txt', 'utf8', function(err, data) {
    if(err) {
        console.error(err);
        return;
    }
    var result = JSON.parse(data);
    for(var i = 0; i < result.length; i++) {
        console.log(result[i]);
    }
})