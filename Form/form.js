//Hide banner at start of script
const errorBanner = document.getElementById("invalid-form");
const successBanner = document.getElementById("valid-form");
errorBanner.hidden = true;
successBanner.hidden = true;
let editFlag = false;
let editId = 0;

//Custom method for FETCH API functionality 
const fetchMethod = (url, fetchParameters, callback) => {
    fetch(url, fetchParameters)
        .then((response) => {
            return new Promise((resolve) => response.json()
                .then((json) => resolve({
                    status: response.status,
                    json,
                })
            ));
        })
        .then(({status, json}) => {
            callback(status, json);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

//Clear form function
function clearForm() {
    document.getElementById("brand").value = "";
    document.getElementById("name").value = "";
    document.getElementById("model").value = "";
    document.getElementById("colors").value = "";
    document.getElementById("ram").value = "";
    document.getElementById("storage").value = "";
    document.getElementById("rearcam").value = "";
    document.getElementById("frontcam").value = "";
    document.getElementById("cpu").value = "";
    document.getElementById("gpu").value = "";
    document.getElementById("battery").value = "";
    document.getElementById("year").value = "";
    document.getElementById("price").value = "";
}

function displayTable(){ 

    //Create a new FormData object
    const formData = new FormData();

    formData.append("limit", 100);

    //Settings for FETCH API request
    const formId = new FormData();

    let fetchSettings = {
        method: 'POST',
        body: formId
    };

    fetch("http://localhost/", fetchSettings)
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
          .then(({ status, json }) => {
            let displayTable =
                "<table>" +
                "<thead>" +
                "<tr>" +
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
                '<th width="7%">Action</th>' +
                "</tr>" +
                "</thead>" +
                "<tbody>";
                if (typeof json.data !== "undefined") {
                    for (row of json.data) {
                        displayTable +=
                            "<tr>" +
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
                            "<button id='edit' value='" +
                            row.id +
                            "'>Edit</button>" +
                            "</td>" +
                            "</tr>";
                    }
                }
                displayTable += "</tbody></table>";
                document.getElementById("phones").innerHTML =
                displayTable;
        })
};
//Load table on page load
displayTable();

//When submit button is clicked, send a fetch request
document.getElementById("submit")
  .addEventListener("click", (event) => {


    let brand = document.getElementById("brand").value;
    let name = document.getElementById("name").value;
    let model = document.getElementById("model").value;
    let colors = document.getElementById("colors").value;
    let ram = document.getElementById("ram").value;
    let storage = document.getElementById("storage").value;
    let rearcam = document.getElementById("rearcam").value;
    let frontcam = document.getElementById("frontcam").value;
    let cpu = document.getElementById("cpu").value;
    let gpu = document.getElementById("gpu").value;
    let battery = document.getElementById("battery").value;
    let year = document.getElementById("year").value;
    let price = document.getElementById("price").value;

    //Create a new FormData object
    const formData = new FormData();
        formData.append("limit", 100);
        switch(brand) {
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
            case "other":
                brand_id = 0;
                break;
        }
        formData.append("brand_id", brand_id);
        formData.append("name", name);
        formData.append("model", model);
        formData.append("colors", colors);
        formData.append("ram", ram);
        formData.append("storage", storage);
        formData.append("rearcam", rearcam);
        formData.append("frontcam", frontcam);
        formData.append("cpu", cpu);
        formData.append("gpu", gpu); 
        formData.append("battery", battery);
        formData.append("year", year);
        formData.append("price", price);
        if (editFlag) {
            formData.append("operation", "edit");
            formData.append("id", editId);
            editFlag = false;
        } else {
            formData.append("operation", "add");
        }

        //Settings for FETCH API request
        let fetchSettings = {
            method: "POST",
            body: formData,
        };

        //Send FETCH API request
        fetch("http://localhost/", fetchSettings)
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

                //Error handling
                const errorMessages = document.getElementsByClassName("text-danger");
                console.log(errorMessages);
                errorBanner.hidden = true;
                for (htmlElement of errorMessages) {
                    htmlElement.innerHTML = "&nbsp;";
                }
                if (status === 400 || status === 500) {
                    errorBanner.innerText =
                    "Form has errors. Please correct them and resubmit.";
                    errorBanner.hidden = false;
                        for (error of json.errors) {
                        console.log(error);
                        const errorId = error.path + "-error";
                        console.log(errorId);
                        document.getElementById(errorId).innerHTML = error.msg;
                    }
                } else {
                    successBanner.innerText = "Form is valid. Thank you for submitting.";
                    errorBanner.hidden = true;
                    successBanner.hidden = false;
                    displayTable();
                    clearForm();
                }

                if (status === 200) {
                    //handle adding the new product to the list
                        console.log("Form is valid. Thank you for submitting.");
                        successBanner.hidden = false;
                        errorBanner.hidden = true;
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        return;
    }
);

//When edit button is clicked, send a fetch request
document.getElementById("phones").addEventListener("click", (event) => {

    editFlag = true;

    if (event.target.id === "edit") {
        console.log(event.target.value);
        let id = event.target.value;
        editId = id;

        let formData = new FormData();
        formData.append("id", id);
        formData.append("operation", "fetch_phone");
        formData.append("limit", 100);

        let fetchSettings = {
            method: "POST",
            body: formData,
        };

        fetch ("http://localhost/", fetchSettings)
        .then((response) => {
            return new Promise((resolve) => response.json()
                .then((json) => resolve({
                    status: response.status,
                    json,
                })
            ));
        })
        .then(({status, json}) => {
            if (200 === status) {
                console.log(json.data);

                if(json.data !== undefined) {

                    //find brand
                    let brand_id = json.data[0].brand_id;
                    let brand;
                    switch(brand_id) {
                        case 1:
                            brand = "apple";
                            break;
                        case 2:
                            brand = "samsung";
                            break;
                        case 3:
                            brand = "motorola";
                            break;
                        case 4:
                            brand = "onePlus";
                            break;
                        case 5:
                            brand = "google";
                            break;
                        case 6:
                            brand = "nokia";
                            break;
                        case 0:
                            brand = "other";
                            break;
                    }

                    document.getElementById('brand').value = brand;
                    document.getElementById('name').value = json.data[0].name;
                    document.getElementById('model').value = json.data[0].model;
                    document.getElementById('colors').value = json.data[0].colors;
                    document.getElementById('ram').value = json.data[0].memory_gb;
                    document.getElementById('storage').value = json.data[0].storage_gb;
                    document.getElementById('rearcam').value = json.data[0].rear_camera_mp;
                    document.getElementById('frontcam').value = json.data[0].front_camera_mp;
                    document.getElementById('cpu').value = json.data[0].cpu;
                    document.getElementById('gpu').value = json.data[0].gpu;
                    document.getElementById('battery').value = json.data[0].battery;
                    document.getElementById('year').value = json.data[0].release_year;
                    document.getElementById('price').value = json.data[0].price;
                }
            }
        });
    }
});

document.getElementById('search').addEventListener('click', (event) => {
    window.location.href = "../index.html";
});
