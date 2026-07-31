document.getElementById("registerForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const user = {
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        password: document.getElementById("password").value
    };

    const confirmPassword = document.getElementById("confirm_password").value;

    if (user.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        if (data.message === "User registered successfully") {
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error(error);
        alert("Registration failed!");
    });

});

function toggleDarkMode(){

document.body.classList.toggle("dark-mode");

}