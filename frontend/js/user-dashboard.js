function renderProperties(properties) {

    let container = document.getElementById("propertyContainer");

    container.innerHTML = "";

    // No properties found
    if (properties.length === 0) {

        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <h3>No Properties Found</h3>
                <p>Try changing your search filters.</p>
            </div>
        `;

        return;
    }

    // Display properties
    properties.forEach(property => {

        container.innerHTML += `

        <div class="col-md-4 mb-4">

            <div class="card shadow h-100">

                <img src="/${property.image}"
                     class="card-img-top"
                     style="height:220px; object-fit:cover;"
                     alt="${property.property_name}">

                <div class="card-body">

                    <h5>${property.property_name}</h5>

                    <p>📍 ${property.city}</p>

                    <p><strong>₹ ${Number(property.price).toLocaleString("en-IN")}</strong></p>

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

                        <button class="btn btn-danger"
                                onclick="saveWishlist(${property.id})">
                            ❤️
                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

// Load all properties
function loadProperties() {

    fetch("/properties")
        .then(res => res.json())
        .then(renderProperties)
        .catch(error => console.error(error));

}

loadProperties();

// Search
document.getElementById("searchBtn").addEventListener("click", () => {

    const city = document.getElementById("searchCity").value;
    const price = document.getElementById("maxPrice").value;
    const bedrooms = document.getElementById("bedrooms").value;

    fetch(`/search_properties?city=${encodeURIComponent(city)}&price=${price}&bedrooms=${bedrooms}`)
        .then(res => res.json())
        .then(renderProperties)
        .catch(error => console.error(error));

});

// Wishlist
function saveWishlist(propertyId) {

    fetch("/wishlist", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            user_id: 1,
            property_id: propertyId

        })

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

    })

    .catch(error => console.error(error));

}