import { sendDataToServer } from './common.js';

document.addEventListener("DOMContentLoaded", () => {
    /*--------------------------------- MEDIA PLAYER REGISTRATION ------------------------------------- */
    const submitMediaPlayer = document.getElementById("reg_player_submit_btn");

    submitMediaPlayer.addEventListener("click", (e) => {
        e.preventDefault();
        const player_name = document.getElementById("input_player_name").value;
        const assoc_exhibit = document.getElementById("input_player_station").value;
        const resolution = document.getElementById("input_player_resolution").value;
        sendDataToServer("registerMediaPlayer",
            {player_name, assoc_exhibit, resolution}).then(r => {});
    });
});

