document
.getElementById("loginForm")
.addEventListener("submit", function(e){


e.preventDefault();



const user = {


email:
document.getElementById("email").value,


password:
document.getElementById("password").value


};





fetch("http://127.0.0.1:5000/login",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify(user)


})



.then(response=>response.json())


.then(data=>{


console.log(data);



if(data.message==="Login successful"){



localStorage.setItem(
"user",
JSON.stringify(data.user)
);



alert("Login Successful!");




if(data.user.role==="admin"){


window.location.href="admin-dashboard.html";


}

else{


window.location.href="user-dashboard.html";


}



}

else{


alert(data.message);


}



})



.catch(error=>{


console.error(error);


alert("Server connection failed!");



});



});






function togglePassword(){


const password =
document.getElementById("password");


const eye =
document.getElementById("eyeIcon");



if(password.type==="password"){


password.type="text";


eye.className="fa-solid fa-eye-slash";


}

else{


password.type="password";


eye.className="fa-solid fa-eye";


}



}