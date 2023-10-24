import { fetchDataFromServer } from './common.js';

document.addEventListener("DOMContentLoaded", () => {
    /*--------------------------------- SHOW STATIONS ------------------------------------------ */
    const manage_media_players_btn = document.getElementById("manage_media_players_btn");

    manage_media_players_btn.addEventListener("click", (e) => {
        e.preventDefault();
        fetchDataFromServer("manageMediaPlayers")
            .then(r => { console.log(r.data.body); });
    });
});
