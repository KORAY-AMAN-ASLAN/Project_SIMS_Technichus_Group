
document.addEventListener("DOMContentLoaded", () => {

    const submit = document.getElementById("reg_admin_submit_btn");

    submit.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById('input_email').value;
        const password = document.getElementById('input_pw').value;
        const firstName = document.getElementById('input_first_name').value;
        const lastName = document.getElementById('input_last_name').value;

        const payload = {
            firstName,
            lastName,
            email,
            password
        };

        fetch("http://localhost:3000/registerAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Registration successful");
                } else {
                    alert("Registration failed");
                }
            });
    });
});
