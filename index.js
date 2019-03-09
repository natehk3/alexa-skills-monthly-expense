var config = require("./config.json");
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    
    var now = new Date();
    var startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    var endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    if (now.getMonth() == 12) {
        endDate = new Date(now.getFullYear() + 1, 1, 1)
    }
    var start = startDate.toISOString().slice(0, 10);
    var end = endDate.toISOString().slice(0, 10)
    var params = { 
        "TimePeriod" : { 
            "Start" : start, 
            "End" : end
        }, 
        "Granularity" : "MONTHLY",
        "Metrics" : ["AmortizedCost"]
    }
    var costexplorer = new AWS.CostExplorer();
    costexplorer.getCostAndUsage(params, function (err, data) {
      if (err) {
          console.log(err, err.stack); // an error occurred
          callback(err);
      }
      else {    
        console.log(data);           // successful response
        var amount = parseFloat(data["ResultsByTime"][0]["Total"]["AmortizedCost"]["Amount"])
        var amountCurrency = "$" + amount.toFixed(2)
        const response = {
            "statusCode": 200,
            "body": JSON.stringify({ "amount": amountCurrency, "start" : start, "end" : end }),
            "isBase64Encoded": false
        };
        callback(null, response);
      }
    });
};