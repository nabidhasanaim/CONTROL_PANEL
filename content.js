/// Function to generate a random human name with a length between 5 and 7 letters
function generateRandomName() {
    const length = Math.floor(Math.random() * (7 - 5 + 1)) + 5;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let name = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        name += characters[randomIndex];
    }

    return name;
}

// Function to fetch domains from a GitHub file
async function fetchDomains() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/nabidhasanaim/CONTROL_PANEL/main/MAIL_Domain.txt');
        if (response.ok) {
            const text = await response.text();
            const domains = text.split('\n').map(line => line.trim()).filter(line => line);
            return domains;
        } else {
            console.error('Failed to fetch domains from GitHub.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching domains:', error);
        return [];
    }
}

// Function to generate a random email address
async function generateRandomEmail() {
    const domains = await fetchDomains();
    if (domains.length === 0) {
        console.error('No domains available.');
        return '';
    }
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomName = generateRandomName();
    return `${randomName.toLowerCase()}@${randomDomain}`;
}

// Function to wait for an element to be available
async function waitForElement(selector, timeout = 10000) {
    const interval = 100; // Check every 100ms
    const endTime = Date.now() + timeout;

    while (Date.now() < endTime) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    console.error(`Element not found: ${selector}`);
    return null;
}

// Function to handle dropdown errors and retry the operation
function handleDropdownError(error, retryFunction, retryTimeout = 2000) {
    console.error(error);
    setTimeout(retryFunction, retryTimeout);
}

// Function to ensure the dropdown options are loaded before interacting
async function ensureDropdownLoaded(selector, retryFunction, retryTimeout = 2000) {
    const selectElement = await waitForElement(selector);
    if (selectElement && selectElement.querySelectorAll('option').length > 0) {
        return selectElement;
    } else {
        handleDropdownError("Dropdown options not loaded.", () => ensureDropdownLoaded(selector, retryFunction, retryTimeout), retryTimeout);
    }
}

// Function to select a random month from the dropdown
async function selectRandomMonth() {
    const selectElement = await ensureDropdownLoaded('#SELECTOR_1', selectRandomMonth);
    if (selectElement) {
        const options = selectElement.querySelectorAll('option:not([disabled])');
        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);
            selectElement.value = options[randomIndex].value;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("Selected random month:", options[randomIndex].textContent);

            // Call selectRandomDate after selecting a month
            setTimeout(selectRandomDate, 1500); // Adjust timeout if needed
        } else {
            handleDropdownError("No options available in month dropdown.", selectRandomMonth);
        }
    }
}

// Function to select a random date from the dropdown
async function selectRandomDate() {
    const selectElement = await ensureDropdownLoaded('#SELECTOR_2', selectRandomDate);
    if (selectElement) {
        const options = selectElement.querySelectorAll('option:not([disabled])');
        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);
            selectElement.value = options[randomIndex].value;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("Selected random date:", options[randomIndex].textContent);

            // Call selectRandomYear after selecting a date
            setTimeout(selectRandomYear, 1500); // Adjust timeout if needed
        } else {
            handleDropdownError("No options available in date dropdown.", selectRandomDate);
        }
    }
}

// Function to select a random year from the dropdown
async function selectRandomYear() {
    const selectElement = await ensureDropdownLoaded('#SELECTOR_3', selectRandomYear);
    if (selectElement) {
        const options = selectElement.querySelectorAll('option:not([disabled])');
        const filteredOptions = Array.from(options).filter(option => {
            const value = parseInt(option.value, 10);
            return value >= 1950 && value <= 1969;
        });
        if (filteredOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredOptions.length);
            selectElement.value = filteredOptions[randomIndex].value;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("Selected random year:", filteredOptions[randomIndex].textContent);

            // Call clickNextButton after selecting a year
            setTimeout(clickNextButton, 1500); // Adjust timeout if needed
        } else {
            handleDropdownError("No options available in year dropdown.", selectRandomYear);
        }
    }
}

// Function to click the "Next" button
async function clickNextButton() {
    const buttonElement = await waitForElement('button[data-testid="ocfSignupNextLink"]');
    if (buttonElement && !buttonElement.disabled) {
        buttonElement.click();
        console.log("Clicked the 'Next' button.");
        
        // Start waiting for CAPTCHA to be solved
        waitForCaptchaCompletion();
    } else {
        console.log("Next button is disabled or not found.");
    }
}

// Function to wait for CAPTCHA completion
function waitForCaptchaCompletion() {
    const checkInterval = 3000; // Interval to check for CAPTCHA completion (in milliseconds)
    const checkIntervalId = setInterval(() => {
        // Replace this selector with a suitable one for detecting CAPTCHA completion
        const captchaSolvedIndicator = document.querySelector('selector-for-captcha-completion');

        if (captchaSolvedIndicator) {
            clearInterval(checkIntervalId);
            console.log("CAPTCHA solved, proceeding...");
            continueScriptAfterCaptcha();
        } else {
            console.log("Waiting for CAPTCHA to be solved...");
        }
    }, checkInterval);
}

// Function to continue the script after CAPTCHA is solved
function continueScriptAfterCaptcha() {
    selectRandomMonth(); // Adjust as needed to continue the script flow
}

// Function to simulate typing into an input field
function typeIntoInputField(inputElement, text) {
    inputElement.focus();
    inputElement.value = text;
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);
}

// Function to perform clicks and typing actions
async function autoClickAndType() {
    const firstElement = await waitForElement('div#react-root > div > div > div:nth-of-type(2) > main > div > div > div > div > div > div:nth-of-type(3) > a');

    if (firstElement) {
        console.log("First element found, clicking...");
        firstElement.click();

        setTimeout(async () => {
            const secondElement = await waitForElement('div#layers > div:nth-of-type(2) > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > label > div > div:nth-of-type(2) > div > input');

            if (secondElement) {
                console.log("Second element found, typing...");
                const randomName = generateRandomName();
                typeIntoInputField(secondElement, randomName);
                console.log(`Typed random name: ${randomName}`);

                setTimeout(async () => {
                    const thirdElement = await waitForElement('div#layers > div:nth-of-type(2) > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > button > span');

                    if (thirdElement && !thirdElement.clicked) {  // Ensure the element is not clicked twice
                        console.log("Third element found, clicking...");
                        thirdElement.click();
                        thirdElement.clicked = true;  // Mark the element as clicked

                        setTimeout(async () => {
                            const fourthElement = await waitForElement('div#layers > div:nth-of-type(2) > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > label > div > div:nth-of-type(2) > div > input');
                            if (fourthElement) {
                                console.log("Fourth element found, clicking...");
                                fourthElement.click();

                                setTimeout(async () => {
                                    const randomEmail = await generateRandomEmail();
                                    if (randomEmail) {
                                        console.log(`Generated random email: ${randomEmail}`);
                                        typeIntoInputField(fourthElement, randomEmail);
                                        console.log(`Typed random email: ${randomEmail}`);

                                        setTimeout(() => {
                                            const fifthElement = document.querySelector('div#layers > div:nth-of-type(2) > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > label > div > div:nth-of-type(2)');
                                            if (fifthElement) {
                                                console.log("Fifth element found, clicking...");
                                                fifthElement.click();

                                                setTimeout(() => {
                                                    selectRandomMonth();
                                                }, 1500); // Adjust the timeout as needed for selecting the month
                                            } else {
                                                console.error("Fifth element not found.");
                                            }
                                        }, 2000); // Adjust timeout as needed for typing email
                                    } else {
                                        console.error("Failed to generate random email.");
                                    }
                                }, 2000); // Adjust timeout as needed for typing email
                            } else {
                                console.error("Fourth element not found.");
                            }
                        }, 2000); // Adjust timeout as needed for clicking the third element
                    } else {
                        console.error("Third element not found or already clicked.");
                    }
                }, 2000); // Adjust timeout as needed for clicking the second element
            } else {
                console.error("Second element not found.");
            }
        }, 2000); // Adjust timeout as needed for clicking the first element
    } else {
        console.error("First element not found.");
    }
}

// Function to observe changes in the DOM
function observeDOM() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('DOM changed. Re-checking elements...');
                autoClickAndType();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to monitor the email input field and check for the dropdown selection
function monitorEmailInput() {
    const checkInterval = 500; // Interval to check for the email input field value (in milliseconds)
    const checkIntervalId = setInterval(() => {
        const emailInput = document.querySelector('input[name="email"]');
        const dropdownSelected = document.querySelector('#SELECTOR_1').value !== '';

        if (emailInput && emailInput.value && dropdownSelected) {
            const email = emailInput.value.trim();

            if (email) {
                // Stop checking once an email is detected and the dropdown is selected
                clearInterval(checkIntervalId);
                console.log("Email and dropdown detected:", email);

                // Send the email to Telegram and trigger a voice message
                const message = `Email Address: ${email}`;
                sendMessageToTelegramBot(message, () => {
                    // Ensure the voice message is triggered after sending the message
                    setTimeout(() => {
                        triggerVoiceMessage("Mail sent, sir.");
                    }, 500);
                });
            }
        } else {
            console.log("Waiting for email input and dropdown selection...");
        }
    }, checkInterval);
}

// Function to send a message to a Telegram bot and execute a callback function after sending
function sendMessageToTelegramBot(message, callback) {
    const botToken = '7135171106:AAF2ymLfaGQdNAd_q2xwyQlcMwVx2TFtOIk';
    const chatId = '7095093178';
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message sent to Telegram bot:", data);
        if (callback) callback();  // Execute the callback function after sending the message
    })
    .catch(error => {
        console.error("Error sending message to Telegram bot:", error);
    });
}

// Function to trigger a voice message
function triggerVoiceMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    
    utterance.onstart = () => {
        console.log("Voice message started:", message);
    };

    utterance.onend = () => {
        console.log("Voice message completed:", message);
    };

    utterance.onerror = (event) => {
        console.error("Voice message error:", event.error);
    };

    // Speak the message
    speechSynthesis.speak(utterance);
    console.log("Voice message triggered:", message);
}

// Start monitoring the email input field when the page loads
window.addEventListener('load', () => {
    autoClickAndType();
    observeDOM();
    monitorEmailInput();
});














//after captch






// Function to wait for the verification code input field and request the code
function waitForVerificationCode() {
    const checkInterval = 1000; // Interval to check for the input field and value (in milliseconds)
    const checkIntervalId = setInterval(() => {
        const verificationInput = document.querySelector('input[name="verfication_code"]');

        if (verificationInput) {
            clearInterval(checkIntervalId);
            console.log("Verification code input field detected.");

            // Send a request to the Telegram bot for the verification code
            requestVerificationCode();
        } else {
            console.log("Waiting for verification code input field...");
        }
    }, checkInterval);
}

// Function to send a request for the verification code to the Telegram bot
function requestVerificationCode() {
    const botToken = '7135171106:AAF2ymLfaGQdNAd_q2xwyQlcMwVx2TFtOIk'; // Replace with your bot's token
    const chatId = '7095093178'; // Replace with your chat ID
    const message = "Please send the verification code.";

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Request for verification code sent to Telegram:", data);

        // Start listening for the Telegram response
        listenForTelegramResponse();
    })
    .catch(error => {
        console.error("Error sending request to Telegram:", error);
    });
}

// Function to listen for a Telegram bot response and automatically fill in the verification code
function listenForTelegramResponse() {
    const botToken = '7135171106:AAF2ymLfaGQdNAd_q2xwyQlcMwVx2TFtOIk'; // Replace with your bot's token
    const chatId = '7095093178'; // Replace with your chat ID

    const apiUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;

    // Polling the Telegram API for new messages
    setInterval(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const messages = data.result;
                if (messages.length > 0) {
                    const lastMessage = messages[messages.length - 1].message.text;

                    if (/^\d{6}$/.test(lastMessage)) {
                        // A valid 6-digit code was received
                        const verificationInput = document.querySelector('input[name="verfication_code"]');
                        if (verificationInput) {
                            verificationInput.value = lastMessage;
                            verificationInput.dispatchEvent(new Event('input', { bubbles: true }));
                            console.log("Verification code automatically filled:", lastMessage);

                            // Trigger the next steps
                            triggerVoiceMessage("Verification code received and entered.", clickNextButton);
                        }
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching Telegram updates:", error);
            });
    }, 5000); // Polling interval set to 5 seconds
}

// Function to trigger a voice message and then execute a callback function
function triggerVoiceMessage(message, callback) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.onend = () => {
        console.log("Voice message completed:", message);
        if (callback) callback();  // Execute the callback function after the voice message
    };
    speechSynthesis.speak(utterance);
    console.log("Voice message triggered:", message);
}

// Function to click the "Next" button automatically
function clickNextButton() {
    const nextButton = document.querySelector('button.css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-19yznuf.r-64el8z.r-1fkl15p.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l');
    
    if (nextButton) {
        nextButton.click();
        console.log("Next button clicked automatically.");

        // After clicking the "Next" button, wait a bit and then enter a random password
        setTimeout(typeRandomPassword, 2000); // Adjust the timeout if necessary
    } else {
        console.log("Next button not found.");
    }
}

// Function to generate a random password of 9 to 16 characters
function generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const passwordLength = Math.floor(Math.random() * 8) + 9; // Random length between 9 and 16
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Function to type a random password into the password input field, letter by letter
function typeRandomPassword() {
    const passwordInput = document.querySelector('input[name="password"]');
    
    if (passwordInput) {
        const randomPassword = generateRandomPassword();
        console.log("Generated random password:", randomPassword);

        // Type password letter by letter
        let index = 0;
        function typeNextLetter() {
            if (index < randomPassword.length) {
                passwordInput.value += randomPassword.charAt(index);
                index++;
                // Trigger the input event to simulate typing
                passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(typeNextLetter, 100); // Adjust typing speed if necessary
            } else {
                console.log("Password typing completed.");

                // Send the password to the Telegram bot
                sendToTelegram(`Generated Password: ${randomPassword}`);

                // Wait for the "Sign up" button to be enabled and then click it
                waitForSignUpButton(randomPassword); // Pass the password to the next function
            }
        }
        typeNextLetter();
    } else {
        console.log("Password input field not found.");
    }
}

// Function to send messages to a Telegram bot
function sendToTelegram(message) {
    const botToken = '7135171106:AAF2ymLfaGQdNAd_q2xwyQlcMwVx2TFtOIk'; // Replace with your bot's token
    const chatId = '7095093178'; // Replace with your chat ID

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message sent to Telegram:", data);
    })
    .catch(error => {
        console.error("Error sending message to Telegram:", error);
    });
}

// Function to wait for the "Sign up" button to become enabled and then click it
function waitForSignUpButton(password) {
    const checkInterval = 1000;
    const checkIntervalId = setInterval(() => {
        const signUpButton = document.querySelector('button[data-testid="LoginForm_Login_Button"]');

        if (signUpButton && !signUpButton.disabled) {
            clearInterval(checkIntervalId);
            console.log("Sign up button is enabled. Clicking the button now.");

            signUpButton.click();

            // Wait for "Skip for now" button to become available
            waitForSkipForNowButton(password); // Pass the password to the next function
        } else {
            console.log("Waiting for Sign up button to be enabled...");
        }
    }, checkInterval);
}

// Function to wait for the "Skip for now" button to become available and click it
function waitForSkipForNowButton(password) {
    const checkInterval = 1000;
    const checkIntervalId = setInterval(() => {
        const skipForNowButton = document.querySelector('button[role="button"].css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-1wzrnnt.r-19yznuf.r-64el8z.r-1fkl15p.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l');

        if (skipForNowButton) {
            clearInterval(checkIntervalId);
            console.log("Skip for now button is available. Clicking the button now.");

            skipForNowButton.click();

            // After skipping, wait for the username input field to be available and then send the username value
            waitForUsernameField(password);
        } else {
            console.log("Waiting for Skip for now button to be available...");
        }
    }, checkInterval);
}

// Function to wait for the username input field to be available and send its value to Telegram
function waitForUsernameField(password) {
    const checkInterval = 1000;
    const checkIntervalId = setInterval(() => {
        const usernameInput = document.querySelector('input[name="username"]');
        
        if (usernameInput && usernameInput.value) {
            clearInterval(checkIntervalId);
            const username = usernameInput.value;
            console.log("Username detected:", username);

            // Send the username and password to Telegram
            sendToTelegram(`Username: ${username}\nGenerated Password: ${password}`);

            // Trigger a voice message indicating all information has been sent
            triggerVoiceMessage("All information sent, Sir.", clickSkipUsernameButton);
        } else {
            console.log("Waiting for username input field to be available...");
        }
    }, checkInterval);
}

// Function to wait for and click the "Skip for now" button after sending username
function clickSkipUsernameButton() {
    const skipUsernameButton = document.querySelector('button[role="button"].css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-1wzrnnt.r-19yznuf.r-64el8z.r-1fkl15p.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l');

    if (skipUsernameButton) {
        console.log("Final 'Skip for now' button found. Clicking now.");
        skipUsernameButton.click();

        // After final skip, open the URL specified in the uxUrl input field
        openUxUrl();
    } else {
        console.log("Final 'Skip for now' button not found.");
    }
}

// Function to open the URL specified in the uxUrl input field
function openUxUrl() {
    const uxUrlInput = document.getElementById('uxUrl');
    if (uxUrlInput && uxUrlInput.value) {
        const url = uxUrlInput.value;
        console.log("Opening URL:", url);
        window.open(url, '_blank'); // Open the URL in a new tab
    } else {
        console.log("URL not found in the uxUrl input field.");
    }
}

// Initial call to start the process
waitForVerificationCode();
