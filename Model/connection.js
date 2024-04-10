const mysql = require("mysql2/promise");

let connection = null;



//async means that the function will always return a promise
async function query(sql, params) {
    if (null === connection){
        connection = await mysql.createConnection({
            host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
            user: "THERONLINDSAY",
            password: "P9cdDuUSBadzfZrLJ8RdQYPvGFrRBolPJeI",
            database: "THERONLINDSAY"
        });
    }
    sql = mysql.format(sql, params); // sanitize inputs, Shows the query with the values inserted
    console.log(sql); // log the query to the console
    const [results, ] = await connection.execute(sql, params); // execute the query, await is used to wait for the promise to resolve
    return results;
}



module.exports = {
    query, //export the query function
}