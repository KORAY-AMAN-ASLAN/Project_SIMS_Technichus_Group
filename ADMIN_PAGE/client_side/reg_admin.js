import { sendDataToServer } from './common.js';

document.addEventListener("DOMContentLoaded", () => {
    /*--------------------------------- ADMINISTRATOR REGISTRATION------------------------------------- */
    const submitAdmin = document.getElementById("reg_admin_submit_btn");
    submitAdmin.addEventListener("click", (e) => {

        console.log("You clicked the admin registration submit button.");

        e.preventDefault();
        const email = document.getElementById('input_email').value;
        const password = document.getElementById('input_pw').value;
        const firstName = document.getElementById('input_first_name').value;
        const lastName = document.getElementById('input_last_name').value;
        sendDataToServer("registerAdmin", {firstName, lastName, email, password})
            .then(r => { window.location.href = "../public/dashboard.html"; });
    });
});
