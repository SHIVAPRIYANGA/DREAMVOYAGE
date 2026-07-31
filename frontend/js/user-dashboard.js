function renderProperties(properties) {

    let container = document.getElementById("propertyContainer");

    container.innerHTML = "";

    if (properties.length === 0) {

        container.innerHTML += `
<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow h-100">

<img src="http://127.0.0.1:5000/${property.image}"
class="card-img-top">

<div class="card-body">

<h5>${property.property_name}</h5>

<p>📍 ${property.city}</p>

<p class="price">
₹ ${Number(property.price).toLocaleString()}
</p>

<p>
🛏 ${property.bedrooms} BHK |
🛁 ${property.bathrooms} Bath |
📐 ${property.sqft} Sq.ft
</p>

<div class="d-flex justify-content-between">

<a href="property-details.html?id=${property.id}"
class="btn btn-primary">

View Details

</a>

<button
class="btn btn-danger"
onclick="saveWishlist(${property.id})">

❤️

</button>

</div>

</div>

</div>

</div>
`

        return;
    }

    properties.forEach(property => {

        container.innerHTML += `

        <div class="col-md-4 mb-4">

            <div class="card shadow h-100">

                <img src="http://127.0.0.1:5000/${property.image}"
                     class="card-img-top"
                     style="height:220px; object-fit:cover;">

                <div class="card-body">

                    <h5>${property.property_name}</h5>

                    <p>📍 ${property.city}</p>

                    <p><strong>₹ ${property.price}</strong></p>

                    <p>${property.bedrooms} BHK | ${property.sqft} Sqft</p>

                    <a href="property-details.html?id=${property.id}"
                       class="btn btn-primary">
                        View Details
                    </a>

                </div>

            </div>

        </div>

        `;

    });

}

function loadProperties() {

    fetch("http://127.0.0.1:5000/properties")

    .then(res => res.json())

    .then(renderProperties);

}

loadProperties();

document.getElementById("searchBtn").addEventListener("click", () => {

    const city = document.getElementById("searchCity").value;

    const price = document.getElementById("maxPrice").value;

    const bedrooms = document.getElementById("bedrooms").value;

    fetch(`http://127.0.0.1:5000/search_properties?city=${encodeURIComponent(city)}&price=${price}&bedrooms=${bedrooms}`)

    .then(res => res.json())

    .then(renderProperties);

});

function saveWishlist(propertyId){

fetch("http://127.0.0.1:5000/wishlist",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:1,
property_id:propertyId

})

})

.then(res=>res.json())

.then(data=>{

alert(data.message);

});

}