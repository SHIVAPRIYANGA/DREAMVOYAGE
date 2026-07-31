function loadProperties() {

    fetch("/admin/properties")

    .then(res => res.json())

    .then(properties => {

        let table = document.getElementById("propertyTable");

        table.innerHTML = "";

        properties.forEach(property => {

            table.innerHTML += `

            <tr>

                <td>${property.id}</td>

                <td>${property.property_name}</td>

                <td>${property.city}</td>

                <td>₹ ${property.price}</td>

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

    });

}

function deleteProperty(id) {

    if(confirm("Are you sure you want to delete this property?")) {

        fetch(`/delete_property/${id}`, {

            method:"DELETE"

        })

        .then(res=>res.json())

        .then(data=>{

            alert(data.message);

            loadProperties();

        });

    }

}

function editProperty(id){

    window.location.href = `edit-property.html?id=${id}`;

}


loadProperties();