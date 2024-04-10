//Hide banner at start of script
const errorBanner = document.getElementById("invalid-form");
const successBanner = document.getElementById("valid-form");
errorBanner.hidden = true;
successBanner.hidden = true;
let editFlag = false;


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

        formData.append("operation", "add");
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
            formData.append("id", id);
            editFlag = false;
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
                //console.log(errorMessages);
                errorBanner.hidden = true;
                for (htmlElement of errorMessages) {
                    htmlElement.innerHTML = "&nbsp;";
                }
                if (status === 400) {
                    errorBanner.innerText =
                    "Form has errors. Please correct them and resubmit.";
                    errorBanner.hidden = false;
                        for (error of json.errors) {
                        //console.log(error);
                        const errorId = error.path + "-error";
                        //console.log(errorId);
                        document.getElementById(errorId).innerHTML = error.msg;
                    }
                } else {
                    successBanner.innerText = "Form is valid. Thank you for submitting.";
                    errorBanner.hidden = true;
                    successBanner.hidden = false;
                    displayTable();
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



document.getElementById('search').addEventListener('click', (event) => {
    window.location.href = "../index.html";
});
