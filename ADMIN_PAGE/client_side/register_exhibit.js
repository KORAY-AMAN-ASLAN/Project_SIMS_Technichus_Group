import { sendDataToServer } from './common.js';

document.addEventListener("DOMContentLoaded", () => {
    /* --------------------------------- EXHIBIT REGISTRATION ------------------------------------------ */
    const submitExhibit = document.getElementById("reg_exh_submit_btn");
    submitExhibit.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("You entered the exhibit name: ", document.getElementById('input_exh_name').value);
        const name = document.getElementById('input_exh_name').value;
        const theme = document.getElementById('input_exh_theme').value;
        sendDataToServer("registerExhibit", {name, theme})
            .then(r => { });
    });
});

