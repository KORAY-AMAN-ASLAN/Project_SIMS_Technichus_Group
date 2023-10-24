
/**
 * @param endpoint
 * The backend server endpoint, which is the
 * URL of the request.
 * @param payloadData
 * The data to be processed in the request
 * @returns {Promise<unknown>}
 * Promises are used for handling asynchronous
 * operations. It's an object representing the
 * eventual completion or failure of an
 * asynchronous operation and its resulting value. */

// POST requests
async function sendDataToServer(endpoint, payloadData) {

    console.log("Data to send: ", payloadData);

    console.log("inside sendDataToServer function " +
        "in file ´common.js´");

    return new Promise((resolve, reject) => {

        console.log("in promise of sendDataToServer function");

        fetch(`http://localhost:3000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadData),
            credentials: 'include'
        })
            /* First the response object is received,
             * which contains both the data and the
             * status of the request, status text,
             * headers, and methods for further operations.*/
            .then(response => {
                console.log("response received in sendDataToServer function");

                if (response.ok) {
                    return response.json().then(data => resolve(data));
                }
                else {
                    return response.json().then(data => reject(data));
                }
            })
            .catch(error => {
                console.log("Data was rejected in common.js sendDataToServer fetch request");
                reject(error);
            });
    });
}

// GET requests
async function fetchDataFromServer(endpoint) {

    console.log('Handling the API endpoint:', endpoint);

    return new Promise((resolve, reject) => {

        console.log("in fetchDataFromServer promise");

        fetch(`http://localhost:3000/${endpoint}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        })
            .then(response => {

                console.log("in fetchDataFromServer response handler");
                if (response.ok) { return response.json(); }
                else {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
            })
            .then(data => {
                console.log("The data is: ", data);
                resolve(data);
            })
            .catch(error => {
                console.log("An error occurred: ", error);
                reject(error);
            });
    });
}

// Export the functions such that they can be used in other files
export { sendDataToServer, fetchDataFromServer };

