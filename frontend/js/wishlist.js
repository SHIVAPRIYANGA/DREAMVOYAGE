const userId = 1;

fetch(`http://127.0.0.1:5000/wishlist/${userId}`)

.then(res => res.json())

.then(properties=>{

const container=document.getElementById("wishlistContainer");

container.innerHTML="";

if(properties.length===0){

container.innerHTML=`

<div class="col-12">

<div class="alert alert-warning text-center">

No Saved Properties ❤️

</div>

</div>

`;

return;

}

properties.forEach(property=>{

container.innerHTML+=`

<div class="col-md-4 mb-4">

<div class="card shadow h-100">

<img
src="http://127.0.0.1:5000/${property.image}"
class="card-img-top">

<div class="card-body">

<h5>${property.property_name}</h5>

<p>📍 ${property.city}</p>

<p class="price">

₹ ${Number(property.price).toLocaleString()}

</p>

<a
href="property-details.html?id=${property.id}"
class="btn btn-primary w-100">

View Details

</a>

</div>

</div>

</div>

`;

});

});