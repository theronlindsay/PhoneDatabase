//Libraries
const express = require("express");
const multer = require("multer");
const phones = require("./Model/phones");
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
const port = 3000; //Default port to http server

//Load the GUI
app.use(express.static("./Server/public")); //Serve static files from the public folder

//CRUD operations

//Read
//JSON of phones from the database
app.get("/phones/", upload.none(), async (request, response) => {
    //SELECT statement variables
    try {
      const result = await phones.selectAllRows(request); //Get all rows from the Phones table
      return response.json({data: result}); //Return the data as a JSON object  
      
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({message: "Something went wrong with the server."});
    }
});

//Read
//JSON of a class from the database
app.get("/phones/:id", upload.none(), async (request, response) => {
    //SELECT statement variables

    try {
      const result = await phones.selectById(request.params.id); //Get row from the Phones table by ID
      return response.json({data: result}); //Return the data as a JSON object  
      
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({message: "Something went wrong with the server."});
    }
});

//Create
//Add a new phone to the database
app.post("/phones/", upload.none(),
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
            .json({
                message: 'Request fields or files are invalid.',
                errors: errors.array(),
            });

    } else {
      //INSERT statement variables
      try {
        const result = await phones.addRow(request.body); //Insert a new row into the Phones table
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

//Update
//Update a phone in the database
app.put("/phones/:id", upload.none(),
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
            .json({
                message: 'Request fields or files are invalid.',
                errors: errors.array(),
            });
  
    } else {

      //UPDATE statement variables
      try {
        const result = await phones.updateRow(request); //Update a row in the Phones table by ID
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

//Delete
//Delete a phone from the database
app.delete("/phones/:id", upload.none(), async (request, response) => {
    //DELETE statement variables
    console.log(request.params.id)
    try {
      const result = await phones.deleteRow(request.params.id); //Delete a row from the Phones table by ID
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
