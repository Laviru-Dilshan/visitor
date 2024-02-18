// device.js

document.addEventListener('DOMContentLoaded', function () {
    // Wait for the DOM to be fully loaded before retrieving device data

    // Function to get the user's location
    function getUserLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                error => {
                    console.error('Error getting location:', error);
                    reject(error);
                }
            );
        });
    }

    // Function to get the user's IP address using an external service
    function getUserIPAddress() {
        return fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip)
            .catch(error => {
                console.error('Error getting IP address:', error);
                return null;
            });
    }

    // Create a new Date object
    var currentDateTime = new Date();

    // Get the current date components
    var year = currentDateTime.getFullYear();
    var month = currentDateTime.getMonth() + 1; // Months are zero-indexed, so we add 1
    var day = currentDateTime.getDate();

    // Get the current time components
    var hours = currentDateTime.getHours();
    var minutes = currentDateTime.getMinutes();
    var seconds = currentDateTime.getSeconds();

    // Format the date and time as YYYY-MM-DD HH:MM:SS
    var formattedDateTime = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day +
                            ' ' + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

    // Get device information using the navigator object
    var deviceData = {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        platform: navigator.platform,
        ram: navigator.deviceMemory,
        appName: navigator.appName,
        battery: navigator.battery,
        cookieEnabled: navigator.cookieEnabled,
        time: formattedDateTime
    };

    // Ask for location permission and get the user's location
    getUserLocation().then(location => {
        // Add location data to the deviceData
        deviceData.location = location;

        // Get the user's IP address
        getUserIPAddress().then(ipAddress => {
            deviceData.ipAddress = ipAddress;

            // Send device data to data.php using Fetch API
            sendDataToServer(deviceData);
        })
        .catch(() => {
            // If getting IP address fails, send data without location
            sendDataToServer(deviceData);
        });
    })
    .catch(() => {
        // If getting location fails, send data without location
        getUserIPAddress().then(ipAddress => {
            deviceData.ipAddress = ipAddress;
            sendDataToServer(deviceData);
        })
        .catch(() => {
            // If both location and IP address fail, send a minimal set of data
            sendDataToServer({ error: 'Failed to retrieve location and IP address' });
        });
    });

    // Function to send data to data.php using Fetch API
    function sendDataToServer(data) {
        fetch('./php/data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(responseData => {
            console.log('Data sent successfully:', responseData);
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }
});
