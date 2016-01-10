module.exports = function(t) {
     var year = t.getFullYear();
     var month = t.getMonth() + 1;
     var day = t.getDate();

     month = month < 10 ? "0" + month : month;
     day = day < 10 ? "0" + day : day;

     return year + "-" + month + "-" + day;
};