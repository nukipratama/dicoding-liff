window.onload = function () {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1653878998-E8O16RGj";   // change the default LIFF value if you are not using a node server
    var profileName = "Customer";
    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function (reqResponse) {
                return reqResponse.json();
            })
            .then(function (jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function (error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").setAttribute('class', 'hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    registerButtonHandlers();

    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        liff.getProfile().then(function (profile) {
            document.getElementById('customerName').textContent = profile.displayName;
            profileName = profile.displayName;
            const profilePictureDiv = document.getElementById('profilePictureDiv');
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = 'Profile Picture';
            img.setAttribute('class', 'img-fluid rounded-circle');
            profilePictureDiv.appendChild(img);

        }).catch(function (error) {
            window.alert('Error getting profile: ' + error);
        });
        displayIsInClientInfo();
        document.getElementById('liffLoginButton').classList.add('hidden');
        document.getElementById('pesanLoggedIn').classList.remove('hidden');
    } else {
        document.getElementById('intro').setAttribute('class', 'col-md-12 col-12');

        document.getElementById('pesanLoggedOut').classList.remove('hidden');
        document.getElementById("liffAppContent").classList.add('hidden');
    }
}

/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (!liff.isInClient()) {
        document.getElementById("liffLogoutButton").classList.remove('hidden');
    } else {
        document.getElementById("openWindowButton").classList.remove('hidden');
        document.getElementById('intro').setAttribute('class', 'col-md-12 col-12');
    }
}

/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers() {
    // openWindow call
    document.getElementById('openWindowButton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://dicoding-liff.nukipratama.tech',
            external: true
        });
    });

    // login call, only when external browser is used
    document.getElementById('liffLoginButton').addEventListener('click', function () {
        if (!liff.isLoggedIn()) {
            // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
            liff.login();
        }
    });

    // logout call only when external browse
    document.getElementById('liffLogoutButton').addEventListener('click', function () {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
    // sendMessages call
    document.getElementById('sendMessageButton').addEventListener('click', function () {
        if (printPesanan(profileName) == null) {
            window.alert('Pesanan kosong!');
        } else {
            if (!liff.isInClient()) {
                sendAlertIfNotInClient();
            } else {
                liff.sendMessages([{
                    'type': 'text',
                    'text': printPesanan(profileName)
                }]).then(function () {
                    window.alert('Pesanan terkirim!');
                    liff.closeWindow();
                }).catch(function (error) {
                    window.alert('Error sending message: ' + error);
                });
            }
        }
    });

}

/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('Fitur ini hanya dapat digunakan pada aplikasi LINE.');
}
