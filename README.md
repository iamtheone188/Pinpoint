# Pinpoint
CS294S Project by Gabriel Kho and Kevin Han

To access the website (may be out of date) go to: http://www.web.stanford.edu/~khan18/Pinpoint/

To get Pinpoint to work on your own web server, you will need to follow these steps:
1. Create a Parse account
2. From Parse, add a new application and make note of the APP_ID and JS_KEY values
3. From the app database, create a Stats database (can be named anything) and make note of the Database ID.
4. Pull the Pinpoint drawer application code from https://github.com/iamtheone188/PinpointOmlet.git and add it to Omlet
5. Replace any instance of http://web.stanford.edu/~khan18 in the Pinpoint drawer application code with your own web server address
6. Replace line 8 of app.js in the app directory with your APP_ID and JS_KEY values
7. Pull the main Pinpoint code from https://github.com/iamtheone188/Pinpoint.git
8. Switch to the dev-parseOnly branch and run this code on the web server
9. Replace line 4 of app.js in the app directory with your APP_ID and JS_KEY values
10. Replace any instance of "FCp1oHcDNh" with your Stats database ID.
