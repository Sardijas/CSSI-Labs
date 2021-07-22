let incorrectCount = 0;

const getMessages = () => {
    const messageRef = firebase.database().ref();
    
    messageRef.on("value", (snapshot) => {
        //snapshot current state of database
        const data = snapshot.val();
        //console.log(data);

        const passcodeAttempt = document.querySelector("#passcode").value;

        const messageDisplay = document.querySelector("#message");
        messageDisplay.innerHTML = "";

        for (const recordKey in data) {
            console.log(recordKey);
            console.log(data[recordKey]);

            const record = data[recordKey];
            const storedPasscode = record.passcode;

            console.log(record);

            console.log(passcodeAttempt);
            console.log(storedPasscode);

            if (incorrectCount >= 5) {
            renderMessageAsHtml("Too many attempts");
            }
            else if (passcodeAttempt === storedPasscode) {
                console.log(`Message is: ${record.message}`);
                renderMessageAsHtml(record.message);
            }
        }

        if (messageDisplay.innerHTML == "") {
            renderMessageAsHtml("Incorrect Password");
            incorrectCount++;
        }

    });
}

const renderMessageAsHtml = (message) => {
    const passcodeInput = document.querySelector("#passcode");
    passcodeInput.value = "";

    const messageDisplay = document.querySelector("#message");
    messageDisplay.innerHTML = message;
}