document.getElementById("propertyForm").addEventListener("submit", function(e){

    e.preventDefault();

    const formData = new FormData();

    formData.append("property_name", document.getElementById("property_name").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("area", document.getElementById("area").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("bedrooms", document.getElementById("bedrooms").value);
    formData.append("bathrooms", document.getElementById("bathrooms").value);
    formData.append("sqft", document.getElementById("sqft").value);
    formData.append("description", document.getElementById("description").value);

    const image = document.getElementById("image").files[0];

    if(image){
        formData.append("image", image);
    }

    fetch("/add_property", {

        method: "POST",

        body: formData

    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        document.getElementById("propertyForm").reset();

        window.location.href = "manage-properties.html";

    })
    .catch(error => {

        console.error(error);

        alert("Failed to add property.");

    });

});