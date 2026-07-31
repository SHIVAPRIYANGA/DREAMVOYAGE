const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Load property details
fetch(`/property_edit/${id}`)
.then(res => res.json())
.then(property => {

    document.getElementById("property_name").value = property.property_name;
    document.getElementById("city").value = property.city;
    document.getElementById("area").value = property.area;
    document.getElementById("price").value = property.price;
    document.getElementById("bedrooms").value = property.bedrooms;
    document.getElementById("bathrooms").value = property.bathrooms;
    document.getElementById("sqft").value = property.sqft;
    document.getElementById("image").value = property.image;
    document.getElementById("description").value = property.description;

});

// Update property
document.getElementById("editPropertyForm").addEventListener("submit", function(e){

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

    fetch(`http://127.0.0.1:5000/update_property/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(property)

    })

    .then(res=>res.json())

    .then(data=>{

        alert(data.message);

        window.location.href="manage-properties.html";

    });

});