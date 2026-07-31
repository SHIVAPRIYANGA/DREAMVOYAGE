document.getElementById("predictForm").addEventListener("submit", function(e){

    e.preventDefault();

    const data = {

        city: document.getElementById("city").value,
        bedrooms: document.getElementById("bedrooms").value,
        bathrooms: document.getElementById("bathrooms").value,
        sqft: document.getElementById("sqft").value

    };

    fetch("http://127.0.0.1:5000/predict_price",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    })

    .then(res=>res.json())

    .then(result=>{

        document.getElementById("result").innerHTML =
        "🏠 Predicted Price: ₹ " +
        Number(result.predicted_price).toLocaleString();

    });

});