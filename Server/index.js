//Libraries
const express = require("express");
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
app.post("/", upload.none(), (request, response) => {
  //SELECT statement variables
  let selectSql = `SELECT
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
  const queryParameters = [];
  
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
});

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
