document
.getElementById("registerForm")
.addEventListener("submit", function(e){


e.preventDefault();



const user = {


full_name:
document.getElementById("full_name").value,


email:
document.getElementById("email").value,


mobile:
document.getElementById("mobile").value,


password:
document.getElementById("password").value


};





fetch("/register", {


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify(user)


})



.then(response=>response.json())


.then(data=>{


alert(data.message);



if(data.message==="User registered successfully"){


window.location.href="login.html";


}



})


.catch(error=>{


console.error(error);


alert("Registration failed!");



});



});







function togglePassword(){


const password=document.getElementById("password");

const eye=document.getElementById("eyeIcon");



if(password.type==="password"){


password.type="text";


eye.className="fa-solid fa-eye-slash";


}

else{


password.type="password";


eye.className="fa-solid fa-eye";


}


}





document
.getElementById("password")
.addEventListener("input",function(){


let length=this.value.length;

let bar=document.getElementById("strengthBar");



if(length<4){


bar.style.width="25%";

bar.className="progress-bar bg-danger";


}

else if(length<8){


bar.style.width="60%";

bar.className="progress-bar bg-warning";


}

else{


bar.style.width="100%";

bar.className="progress-bar bg-success";


}



});