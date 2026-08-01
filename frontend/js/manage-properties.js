function loadProperties() {

    fetch("/admin/properties")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }
            return response.json();
        })
        .then(properties => {

            const table = document.getElementById("propertyTable");
            table.innerHTML = "";

            if (properties.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">
                            No properties found
                        </td>
                    </tr>
                `;
                return;
            }

            properties.forEach(property => {

                table.innerHTML += `
                    <tr>
                        <td>${property.id}</td>
                        <td>${property.property_name}</td>
                        <td>${property.city}</td>
                        <td>₹ ${Number(property.price).toLocaleString("en-IN")}</td>
                        <td>
                            <button
                                class="btn btn-warning btn-sm me-2"
                                onclick="editProperty(${property.id})">
                                Edit
                            </button>

                            <button
                                class="btn btn-danger btn-sm"
                                onclick="deleteProperty(${property.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;

            });

        })
        .catch(error => {
            console.error(error);
            alert("Unable to load properties.");
        });

}

function deleteProperty(id) {

    if (!confirm("Are you sure you want to delete this property?")) {
        return;
    }

    fetch(`/delete_property/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadProperties();
    })
    .catch(error => {
        console.error(error);
        alert("Unable to delete property.");
    });

}

function editProperty(id) {
    window.location.href = `edit-property.html?id=${id}`;
}

loadProperties();