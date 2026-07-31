// Top Cards
fetch("http://127.0.0.1:5000/analytics")

.then(res => res.json())

.then(data => {

    document.getElementById("users").innerHTML = data.users;

    document.getElementById("properties").innerHTML = data.properties;

    document.getElementById("wishlist").innerHTML = data.wishlist;

    document.getElementById("average").innerHTML =
        "₹ " + Number(data.average_price).toLocaleString();

});

// Bar Chart
fetch("http://127.0.0.1:5000/analytics_chart")

.then(res => res.json())

.then(data => {

    const cities = data.map(item => item.city);

    const totals = data.map(item => item.total);

    new Chart(document.getElementById("cityChart"), {

        type: "bar",

        data: {

            labels: cities,

            datasets: [{

                label: "Properties",

                data: totals

            }]

        }

    });

});

// Pie Chart
fetch("http://127.0.0.1:5000/analytics")

.then(res => res.json())

.then(data => {

    new Chart(document.getElementById("wishlistChart"), {

        type: "pie",

        data: {

            labels: ["Wishlist", "Properties"],

            datasets: [{

                data: [
                    data.wishlist,
                    data.properties
                ]

            }]

        }

    });

});