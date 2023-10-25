"use strict"

import { sendDataToServer, fetchDataFromServer } from './common.js';

document.addEventListener("DOMContentLoaded", () => {

    const welcomeDiv = document.getElementById('welcome_msg');
    const login_div = document.getElementById('log_in_btn_div');
    const logout_div = document.getElementById('logout_btn_div');

    fetchDataFromServer('is-logged-in').then(data => {

        console.log("Checking to see if someone is logged in...");
        console.log("returned value is:", data);

        if (data.isLoggedIn) {
            console.log("admin is logged in");
            login_div.style.display = 'none';
            welcomeDiv.style.display = 'block';
            welcomeDiv.style.marginRight= '40px';
            logout_div.style.display = 'block';
            welcomeDiv.innerHTML += data.name;
        }
        else {
            console.log("admin is NOT logged in");
            welcomeDiv.style.display = 'none';
            logout_div.style.display = 'none';
        }})
        .catch(errorData => {
        console.error("Data was rejected:", errorData);
    });

    document.getElementById("logout_anchor").addEventListener("click", (e) => {
        fetchDataFromServer('logout').then(r => {
            location.reload();
        });
    })

    document.getElementById('show_stations_link').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        let showStationSection = document.getElementById('show_station');
        if (showStationSection.style.display === 'none' || showStationSection.style.display === '') {
            showStationSection.style.display = 'block';
        } else {
            showStationSection.style.display = 'none';
        }
    });


});

