function logout(){

    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    window.location.href="login.html";

}