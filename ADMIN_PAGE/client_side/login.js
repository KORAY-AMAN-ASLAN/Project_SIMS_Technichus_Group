import { sendDataToServer } from './common.js';

document.addEventListener("DOMContentLoaded", () => {
    /*------------------------------------- ADMIN SIGN IN ------------------------------------------ */
    const sign_in_btn = document.getElementById("sign_in_submit_btn");

    sign_in_btn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("You clicked the sign in submit button!");

        const email = document.getElementById('input_email').value;
        const pw = document.getElementById('input_pw').value;

        console.log("Email entered: ", email);
        console.log("Password entered: ", pw);

        console.log("DOM loaded. This log is printed right before the" +
            " sendDataToServer function call");

        sendDataToServer("signIn", { email: email, password: pw })
            .then(data => {
                console.log("data returned: ", data);
                if (data.success) {
                    window.location.href = "../public/dashboard.html";
                }
                else {
                    alert("The provided login credentials are incorrect.");
                    console.log("Failed to sign in");
                }
            });
    });
});

