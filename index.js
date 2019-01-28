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
          var fuelCost = 0
          var fuelType = ""
          if (data.note.value.includes("petrol")) {
            fuelCost = 2.3
            fuelType = "Petrol"
          } else if (data.note.value.includes("diesel")) {
            fuelCost = 1.5
            fuelType = "Diesel"
          } else {
            fuelCost = 2;
            fuelType = "Unknown"
          }
          const results = {milage: parseFloat(milage), make: make, fuelCost: fuelCost, fuelType: fuelType}
          res.send(JSON.stringify(results));
        } else {
          res.send(error);
        }
    })
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Express sever is listening")
});
