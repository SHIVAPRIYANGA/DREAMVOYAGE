const params = new URLSearchParams(window.location.search);

const id = params.get("id");

let currentProperty = null;

fetch(`/property/${id}`)

.then(res=>res.json())

.then(property=>{

currentProperty = property;

document.getElementById("propertyImage").src =
"/"+property.image;

document.getElementById("propertyName").innerHTML =
property.property_name;

document.getElementById("propertyCity").innerHTML =
"📍 "+property.city;

document.getElementById("propertyPrice").innerHTML =
"₹ "+Number(property.price).toLocaleString();

document.getElementById("bedrooms").innerHTML =
property.bedrooms+" BHK";

document.getElementById("bathrooms").innerHTML =
property.bathrooms+" Bath";

document.getElementById("sqft").innerHTML =
property.sqft+" Sq.ft";

document.getElementById("description").innerHTML =
property.description;

});

function saveWishlist(){

fetch("/wishlist",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user_id:1,
property_id:id

})

})

.then(res=>res.json())

.then(data=>{

alert(data.message);

});

}

function predictPrice(){

fetch("/predict_price",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

city:currentProperty.city,

bedrooms:currentProperty.bedrooms,

bathrooms:currentProperty.bathrooms,

sqft:currentProperty.sqft

})

})

.then(res=>res.json())

.then(data=>{

const box=document.getElementById("predictionResult");

box.classList.remove("d-none");

box.innerHTML=

"🤖 AI Estimated Price: ₹ "+
Number(data.predicted_price).toLocaleString();

});

}