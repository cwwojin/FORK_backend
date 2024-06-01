"use strict";


module.exports.handler = (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    return "Hello from Lambda!";
};
