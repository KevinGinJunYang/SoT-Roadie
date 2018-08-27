const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const request = require('request');

app.use(express.static('public'));

app.get('/fuel/:numberPlate', (req, res) => {
    request('http://resources.fuelsaver.govt.nz/ecca_tools_resources/webservices/webservice.php?service=fuel_label_generator&action=get_text&ref_type=plate&ref_value=' + req.params.numberPlate, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const data = JSON.parse(body).data
          const milage = data.milage.value.split(" ")[0];
          const make = data.make.value;
          const results = {milage: parseFloat(milage), make: make}
          res.send(JSON.stringify(results));
        }
    })
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Express sever is listening")
});
