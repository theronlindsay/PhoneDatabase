const connection = require("./connection"); //Import the connection from the connection.js file

async function selectAllRows(parameters = {}) {
    let sqlStatement = "SELECT p.id AS phone_id, b.id AS brand_id, p.*, b.* FROM Phones p INNER JOIN Brands b ON p.brand_id = b.id"; //Initial SELECT statement with INNER JOIN
    const queryParameters = [],
    whereStatements = [],
    orderByStatements = [];


    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (typeof parameters.query.sort !== 'undefined') {
        let sort = parameters.query.sort;
        if (sort === 'ASC') {
            orderByStatements.push('price ASC');
        } else if (sort === 'DESC') {
            orderByStatements.push('price DESC');
        }
    }

    //Brand ID
    if (typeof parameters.query.brand !== 'undefined' && parseInt(parameters.query.brand_id) !== 0) {
        let brand = parameters.query.brand;
        whereStatements.push('brand = ?');
        queryParameters.push(brand);
    }

    //Name
    if (typeof parameters.query.name !== 'undefined' && parseInt(parameters.query.name) !== 0) {
        let name = parameters.query.name;
        whereStatements.push('name = ?');
        queryParameters.push(name);
    }

    //Release year
    if (typeof parameters.query.release_year !== 'undefined' && parseInt(parameters.query.release_year) !== 0) {
        let year = parameters.query.release_year;
        whereStatements.push('release_year = ?');
        queryParameters.push(year);
    }

        
    //Dynamically add WHERE expressions to SELECT statements if needed
    if (whereStatements.length > 0) {
        sqlStatement += ' WHERE ' + whereStatements.join(' AND ');
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (orderByStatements.length > 0) {
        sqlStatement += ' ORDER BY ' + orderByStatements.join(', ');
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (typeof parameters.query.limit !== 'undefined' && parameters.query.limit > 0) {
        sqlStatement += ' LIMIT ' + parameters.query.limit;
    }

    return await connection.query(sqlStatement, queryParameters);
}

async function selectById(parameters = {}) {
    const sqlStatement = "SELECT * FROM Phones WHERE id = ?";
    console.log(parameters.params.id);
    const queryParameters = [parameters.params.id];
    return await connection.query(sqlStatement, queryParameters);
}

async function addRow(parameters = {}) {
    const sqlStatement = "INSERT INTO Phones (brand_id, name, release_year, price) VALUES (?, ?, ?, ?)";
    const queryParameters = [parameters.brand_id, parameters.name, parameters.release_year, parameters.price];
    return await connection.query(sqlStatement, queryParameters);
}

async function updateRow(parameters = {}) {
    const sqlStatement = "UPDATE Phones SET brand_id = ?, name = ?, release_year = ?, price = ? WHERE id = ?";
    const queryParameters = [parameters.brand_id, parameters.name, parameters.release_year, parameters.price, parameters.id];
    return await connection.query(sqlStatement, queryParameters);
}

async function deleteRow(parameters = {}) {
    const sqlStatement = "DELETE FROM Phones WHERE id = ?";
    const queryParameters = [parameters.id];
}

module.exports = {
    selectAllRows,
    selectById,
    addRow,
    updateRow,
    deleteRow
}