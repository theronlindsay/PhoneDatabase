//Libraries
const express = require("express");
const multer = require("multer");
const classes = require("./Model/classes");
const mysql = require("mysql2"); 

//Database connection
const connection = mysql.createConnection({
  host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
  user: "THERONLINDSAY",
  password: "P9cdDuUSBadzfZrLJ8RdQYPvGFrRBolPJeI",
  database: "THERONLINDSAY"
});

//Setup defaults for script
const app = express();
const upload = multer();
const port = 80; //Default port to http server
app.use(express.static("View")); //Serve static files from the View folder

//JSON of classes from the database
app.get("/classes/", upload.none(), async (request, response) => {
  //SELECT statement variables
  try {
    const result = await classes.selectAllRows(request); //Get all rows from the Phones table
    return response.json({data: result}); //Return the data as a JSON object  
    
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({message: "Something went wrong with the server."});
  }
});

app.get("/classes/:id", upload.none(), async (request, response) => {
  //SELECT statement variables
  try {
    const result = await classes.selectById(request); //Get all rows from the Phones table
    return response.json({data: result}); //Return the data as a JSON object  
    
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({message: "Something went wrong with the server."});
  }
});



app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
