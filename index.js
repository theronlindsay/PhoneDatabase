//Libraries
const express = require("express");
const multer = require("multer");
const classes = require("./Model/classes");
const mysql = require("mysql2"); 
const { check, validationResult } = require("express-validator");

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

//JSON of a class from the database
app.get("/classes/:id", upload.none(), async (request, response) => {
    //SELECT statement variables
    try {
      const result = await classes.selectById(request); //Get row from the Phones table by ID
      return response.json({data: result}); //Return the data as a JSON object  
      
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({message: "Something went wrong with the server."});
    }
});

//Add a new phone to the database
app.post("/classes/", upload.none(),
  check("brand_id").isInt(),
  check("name").isString().isLength({min:1}),
  check("model").isString().isLength({min:1}),
  check("colors").isString().isLength({min:1}),
  check("ram").isInt(),
  check("storage").isInt(),
  check("rearcam").isInt(),
  check("frontcam").isInt(),
  check("cpu").isString().isLength({min:1}),
  check("gpu").isString().isLength({min:1}),
  check("battery").isString().isLength({min:1}),
  check("year").isInt(),
  check("price").isInt(),
  async (request, response) => {

    //Validation
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      
        return response
            .status(400)
            .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({
                message: 'Request fields or files are invalid.',
                errors: errors.array(),
            });

    } else {
      //INSERT statement variables
      try {
        const result = await classes.addRow(request.body); //Insert a new row into the Phones table
        return response.json({data: result}); //Return the data as a JSON object  
        
      } catch (error) {
        console.error(error);
        return response
          .status(500)
          .json({message: "Something went wrong with the server."});
      }
    }
  }
);

//Update a phone in the database
app.put("/classes/:id", upload.none(),
  check("brand_id").isInt(),
  check("name").isString().isLength({min:1}),
  check("model").isString().isLength({min:1}),
  check("colors").isString().isLength({min:1}),
  check("ram").isInt(),
  check("storage").isInt(),
  check("rearcam").isInt(),
  check("frontcam").isInt(),
  check("cpu").isString().isLength({min:1}),
  check("gpu").isString().isLength({min:1}),
  check("battery").isString().isLength({min:1}),
  check("year").isInt(),
  check("price").isInt(),
  async (request, response) => {

    //Validation
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        return response
            .status(400)
            .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({
                message: 'Request fields or files are invalid.',
                errors: errors.array(),
            });
  
    } else {

      //UPDATE statement variables
      try {
        const result = await classes.updateRow(request); //Update a row in the Phones table by ID
        return response.json({data: result}); //Return the data as a JSON object  
        
      } catch (error) {
        console.error(error);
        return response
          .status(500)
          .json({message: "Something went wrong with the server."});
      }
    }
  }
);

//Delete a phone from the database
app.delete("/classes/:id", upload.none(), async (request, response) => {
    //DELETE statement variables
    console.log(request.params.id)
    try {
      const result = await classes.deleteRow(request.params.id); //Delete a row from the Phones table by ID
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
