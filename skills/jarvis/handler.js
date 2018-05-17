"use strict"

const fs = require('fs');
const contentType = "application/json; charset=utf-8";
const request = require('request');
const moment = require('moment');


module.exports = (event, context) => {

    // Check if lunch req
    if(event.body.request.type == "LaunchRequest") {
        return launchRequest(context);
    }

    // Other request
    fs.readFile("./function/response.json", "utf8", (err, val) => {

	if(err) {
	    return context.fail(err);
	}
    
	if(event.body.request.intent && event.body.request.intent.name == "status") {
		
		let url = process.env.rasp_ctl_url;
		console.log("rasp_ctl url: " + url)
		const response = JSON.parse(val);

		if(!url.length)  {
		        response.response.outputSpeech.text = "I have an invalid device address!";
		        return context
		             .status(200)
		             .headers({"Content-Type": contentType})
		             .succeed(response);
		}

		url = url + "/state?socket=all"

		const req = {
			uri: url,
		};

		request.get(req, (err, res, body) => {
			
			if(err) {
				response.response.outputSpeech.text = "I'm having trouble to reach the device ..." + err;
				return context
				      .status(200)
		                      .headers({"Content-Type": contentType})
		                      .succeed(response);
			}

			const jsonmap = JSON.parse(body);
			
			const ENABLE = "enable"
			const DISABLE = "disable"

			var map = {};
			map[ENABLE] = []
			map[DISABLE] = []
			for (var key in jsonmap) {
				var value = jsonmap[key], state = DISABLE;
				if (value) {
					state = ENABLE;
				}
				map[state].push(key);
			}

			var resp = "";
			if (map[ENABLE].length == 0) {
				resp = "All of the sockets are disabled !"
			} else if (map[DISABLE].length == 0) {
				resp = "All of the sockets are enabled !"
			} else {
				resp = "socket "
				var socketstr = ""
				var nounce = "are"
				map[ENABLE].forEach(function(value) {
					socketstr += value + ", ";
				});
				if (map[ENABLE].length == 1) {
					nounce = "is"
				}
				resp = resp + socketstr +  nounce + ' enabled, and socket '
				socketstr = ""
				nounce = "are"
				map[DISABLE].forEach(function(value) {
					socketstr += value + ", ";
				});
				if (map[DISABLE].length == 1) {
					nounce = "is"
				}
				resp = resp + socketstr + nounce + ' disabled !'
			}

			response.response.outputSpeech.text = resp

			return context
				.status(200)
				.headers({"Content-Type": contentType})
				.succeed(response);
		});
	} else if (event.body.request.intent && event.body.request.intent.name == "enable" 
		&& event.body.request.intent.slots 
		&& event.body.request.intent.slots.socket 
		&& event.body.request.intent.slots.socket.value)  {

		const response = JSON.parse(val);
		response.response.outputSpeech.text =  event.body.request.intent.slots.socket.value + " is enabled!"; 
		context
		    .status(200)
		    .headers({"Content-Type": contentType})
		    .succeed(response);
	} else if (event.body.request.intent 
		&& (event.body.request.intent.name == "disable" || event.body.request.intent.name == "reset"))  {
		const response = JSON.parse(val);
		response.response.outputSpeech.text = event.body.request.intent.name + " is not implemented!"; 
		context
		    .status(200)
		    .headers({"Content-Type": contentType})
		    .succeed(response);
	} else {

		const response = JSON.parse(val);
		response.response.outputSpeech.text = "I dont know what you just said, you can ask to enable and disable socket or just ask for status!"; 
		context
		    .status(200)
		    .headers({"Content-Type": contentType})
		    .succeed(response);
	}
    });
}

let launchRequest = (context) => {
    fs.readFile("./function/response.json", "utf8", (err, val) => {
        if(err) {
            return context.fail(err);
        }
    
        const response = JSON.parse(val);
        response.response.outputSpeech.text = "Jarvis!"
        response.response.shouldEndSession = false;

        context
            .status(200)
            .headers({"Content-Type": contentType})
            .succeed(response);
    });
};

function getRandomInt(max) {
	  return Math.floor(Math.random() * Math.floor(max));
}
