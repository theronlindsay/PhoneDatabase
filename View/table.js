const isEmpty = (obj) => Object.keys(obj).length === 0;

function displayTable() {
    const queryParams = {};

    if (document.getElementById("limit").value.length === 0) {
        queryParams['limit'] = document.getElementById("limit").value = 100;
    }
    
    if (document.getElementById("name").value.length !== 0) {
        queryParams['name'] = document.getElementById("name").value;    
    }
    if (document.getElementById("brand").value.length !== 0) {
        queryParams['brand'] = document.getElementById("brand").value;    
    }
    if (document.getElementById("release_year").value.length !== 0) {
        queryParams['release_year'] = document.getElementById("release_year").value;    
    }
    if (document.getElementById("sort").value.length !== 0) {
        queryParams['sort'] = document.getElementById("sort").value;    
    } 

    //Settings for FETCH API request
    let fetchSettings = {
        method: "GET",
    };
    
    //Send FETCH API request
    fetch("http://localhost/classes/" + (!isEmpty(queryParams) ? '?' + new URLSearchParams(queryParams) : ''), fetchSettings)
        .then((response) => {
            return new Promise((resolve) =>
                response.json().then((json) =>
                    resolve({
                        status: response.status,
                        json,
                    }),
                ),
            );
        })
        //Logic to display errors on form
        .then(({ status, json }) => {
            if (status === 200) {
                let displayTable =
                    "<table>" +
                    "<thead>" +
                    "<tr>" +
                    '<th width="7%">ID</th>' +
                    '<th width="7%">Brand</th>' +
                    '<th width="7%">Name</th>' +
                    '<th width="7%">Model</th>' +
                    '<th width="10%">Colors</th>' +
                    '<th width="7%">Max Memory</th>' +
                    '<th width="7%">Max Storage</th>' +
                    '<th width="7%">Rear Camera</th>' +
                    '<th width="7%">Front Camera</th>' +
                    '<th width="7%">CPU</th>' +
                    '<th width="7%">GPU</th>' +
                    '<th width="7%">Battery Capacity</th>' +
                    '<th width="7%">Release Year</th>' +
                    '<th width="7%">Price</th>' +
                    '<th width="7%">Edit</th>' +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";
                if (typeof json.data !== "undefined") {
                    for (row of json.data) {
                        displayTable +=
                            "<tr>" +
                            "<td>" +
                            row.phone_id +
                            "</td>" +
                            "<td>" +
                            row.brand +
                            "</td>" +
                            "<td>" +
                            row.name +
                            "</td>" +
                            "<td>" +
                            row.model +
                            "</td>" +
                            "<td>" +
                            row.colors +
                            "</td>" +
                            "<td>" +
                            row.memory_gb +
                            "gb" +
                            "</td>" +
                            "<td>" +
                            row.storage_gb +
                            "gb" +
                            "</td>" +
                            "<td>" +
                            row.rear_camera_mp +
                            "MP" +
                            "</td>" +
                            "<td>" +
                            row.front_camera_mp +
                            "MP" +
                            "</td>" +
                            "<td>" +
                            row.cpu +
                            "</td>" +
                            "<td>" +
                            row.gpu +
                            "</td>" +
                            "<td>" +
                            row.battery +
                            "mAh" +
                            "</td>" +
                            "<td>" +
                            row.release_year +
                            "</td>" +
                            "<td>" +
                            "$" +
                            row.price +
                            "</td>" +
                            "<td>" +
                            '<a href ="./Form/form.html?id=' +
                            row.phone_id +
                            `">Edit</a>` +
                            ' <a href ="./delete.html?id=' +
                            row.phone_id +
                            `">Delete</a>` +
                            "</td>" +
                            "</tr>";
                    }
                }
                displayTable += "</tbody></table>";
                document.getElementById("phones").innerHTML =
                    displayTable;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    return;
}