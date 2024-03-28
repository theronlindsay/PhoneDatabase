//Libraries
const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const mysql = require("mysql2");

//Setup defaults for script
const app = express();
const upload = multer();
const port = 80; //Default port to http server
const connection = mysql.createConnection({
  host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
  user: "THERONLINDSAY",
  password: "P9cdDuUSBadzfZrLJ8RdQYPvGFrRBolPJeI",
  database: "THERONLINDSAY",
});

//The * in app.* needs to match the method type of the request
app.post("/", upload.none(), 

//validation
check('brand_id', 'Please enter a brand').isInt(),
check('name', 'Please enter a name').isLength({ min: 1 }),
check('model', 'Please enter a model').isLength({ min: 1 }),
check('colors', 'Please enter a color').isLength({ min: 1 }),
check('ram', 'Enter an amount of RAM').isInt(),
check('storage', 'Enter how much storage').isInt(),
check('rearcam', 'Enter the amount of MP of the rear camera has.').isInt(),
check('frontcam', 'Please enter how many MP the front camera has.').isInt(),
check('cpu', 'Enter the CPU name').isLength({ min: 1 }),
check('gpu', 'Enter the GPU Name').isLength({ min: 1 }),
check('battery', 'Enter the battery name').isInt(),
check('year', 'Enter the release year of the phone').isInt(),
check('price', 'Enter the price.').isInt(),


(request, response) => {

  const queryParameters = []; //stores parameters for SQL query

  if(request.body.operation === "add") {
    //INSERT statement variables
    let insertSql = `INSERT INTO Phones (brand_id, name, model, colors, memory_gb, storage_gb, rear_camera_mp, front_camera_mp, cpu, gpu, battery, release_year, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    queryParameters.push(request.body.brand_id);
    queryParameters.push(request.body.name);
    queryParameters.push(request.body.model);
    queryParameters.push(request.body.colors);
    queryParameters.push(request.body.ram);
    queryParameters.push(request.body.storage);
    queryParameters.push(request.body.rearcam);
    queryParameters.push(request.body.frontcam);
    queryParameters.push(request.body.cpu); 
    queryParameters.push(request.body.gpu);
    queryParameters.push(request.body.battery); 
    queryParameters.push(request.body.year);
    queryParameters.push(request.body.price);
    console.log(insertSql);
  } else if (request.body.operation === "fetch_phone") {
      let row = request.body.id;
      let selectSql = `SELECT * FROM Phones WHERE id = ?`;
      queryParameters.push(row);
      console.log(selectSql);
  }

  connection.query(insertSql, queryParameters, (error, result) => {
    
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response
          .status(400)
          .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
          .json({
              message: 'Request fields or files are invalid.',
              errors: errors.array(),
              
          });
    } else {
      //Default response object
      return response
        .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
        .json({ message: "Phone added successfully." });
    }
  });


  if(request.body.operation === "fetch_phone"){
    //Find brand id
    let brand = request.body.brand;
    switch (brand) {
      case "apple":
        brand_id = 1;
        break;
      case "samsung":
        brand_id = 2;
        break;
      case "motorola":
        brand_id = 3;
        break;
      case "oneplus":
        brand_id = 4;
        break;
      case "google":
        brand_id = 5;
        break;
      case "nokia":
        brand_id = 6;
        break;
      case 'other':
        brand_id = 0;
        break;
    }
  } else { 
    //SELECT statement variables
    let selectSql = `SELECT
                        p.id AS id,
                        b.brand AS brand,
                        name,
                        colors,
                        price,
                        storage_gb,
                        model,
                        memory_gb,
                        rear_camera_mp,
                        front_camera_mp,
                        battery,
                        cpu,
                        gpu,
                        release_year

                      FROM Phones p
                      INNER JOIN Brands b ON p.brand_id = b.id`;
    let whereStatements = [];
    let orderByStatements = [];
    
    if (
      typeof request.body.brand_id !== "undefined" &&
      parseInt(request.body.brand_id) !== 0
    ) {
      let brand = request.body.brand_id;
      whereStatements.push("brand_id = ?");
      queryParameters.push(brand_id);
    }

    if (
      typeof request.body.name !== "undefined" &&
      parseInt(request.body.name) !== 0
    ) {
      let name = request.body.name;
      whereStatements.push("name = ?");
      queryParameters.push(name);
    }

    if (
      typeof request.body.release_year !== "undefined" &&
      parseInt(request.body.release_year) !== 0
    ) {
      let year = request.body.release_year;
      whereStatements.push("release_year = ?");
      queryParameters.push(year);
    }

    if (typeof request.body.sort !== "undefined") {
      let sort = request.body.sort;
      if (sort === "ASC") {
        orderByStatements.push("price ASC");
      } else if (sort === "DESC") {
        orderByStatements.push("price DESC");
      }
    }

    //Dynamically add WHERE expressions to SELECT statements if needed
    if (whereStatements.length > 0) {
      selectSql = selectSql + " WHERE " + whereStatements.join(" AND ");
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (orderByStatements.length > 0) {
      selectSql = selectSql + " ORDER BY " + orderByStatements.join(", ");
    }

    //Dynamically add LIMIT expressions to SELECT statements if needed
    if (
      typeof request.body.limit !== "undefined" &&
      request.body.limit > 0 &&
      request.body.limit < 6
    ) {
      selectSql = selectSql + " LIMIT " + request.body.limit;
    }

    console.log(selectSql);
    connection.query(selectSql, queryParameters, (error, result) => {
      if (error) {
        console.log(error);
        return response
          .status(500) //Error code when something goes wrong with the server
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
          .json({ message: "Something went wrong with the server." });
      } else {
        //Default response object
        response
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
          .json({ data: result });
      }
    });
  }

  //Edit a phone
  app.post("/edit", upload.none(), (request, response) => {
    //UPDATE statement variables
    let updateSql = `UPDATE Phones SET brand_id = ?, name = ?, model = ?, colors = ?, memory_gb = ?, storage_gb = ?, rear_camera_mp = ?, front_camera_mp = ?, cpu = ?, gpu = ?, battery = ?, release_year = ?, price = ? WHERE id = ?`;
    let queryParameters = [];
    queryParameters.push(request.body.brand_id);
    queryParameters.push(request.body.name);
    queryParameters.push(request.body.model);
    queryParameters.push(request.body.colors);
    queryParameters.push(request.body.ram);
    queryParameters.push(request.body.storage);
    queryParameters.push(request.body.rearcam);
    queryParameters.push(request.body.frontcam);
    queryParameters.push(request.body.cpu);
    queryParameters.push(request.body.gpu);
    queryParameters.push(request.body.battery);
    queryParameters.push(request.body.year);
    queryParameters.push(request.body.price);
    queryParameters.push(request.body.id);

    console.log(updateSql);
    connection.query(updateSql, queryParameters, (error, result) => {
      if (error) {
        console.log(error);
        return response
          .status(500) //Error code when something goes wrong with the server
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
          .json({ message: "Something went wrong with the server." });
      } else {
        //Default response object
        response
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
          .json({ message: "Phone updated successfully." });
      }
    });
  });

  app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
  });
});