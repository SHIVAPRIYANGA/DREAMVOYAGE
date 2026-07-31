document.getElementById("propertyForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const property = {

        property_name: document.getElementById("property_name").value,
        city: document.getElementById("city").value,
        area: document.getElementById("area").value,
        price: document.getElementById("price").value,
        bedrooms: document.getElementById("bedrooms").value,
        bathrooms: document.getElementById("bathrooms").value,
        sqft: document.getElementById("sqft").value,
        image: document.getElementById("image").value,
        description: document.getElementById("description").value

    };

    fetch("http://127.0.0.1:5000/add_property", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(property)

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        document.getElementById("propertyForm").reset();

    })

    .catch(error => {

        console.error(error);

        alert("Error adding property.");

    });

});

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

    formData.append(
        "image",
        document.getElementById("image").files[0]
    );

    fetch("/add_property",{

        method:"POST",

        body:formData

    })

    .then(res=>res.json())

    .then(data=>{

        alert(data.message);

        document.getElementById("propertyForm").reset();

    });

});