"use strict"

const contentType = "text/html"
const request = require('request');

module.exports = (event, context) => {

    // Check if UI request
    if (event.headers.accept.includes("html")) {
	    var pug = require('pug');
	    const compiledFunction = pug.compileFile('./function/assets/jarvis.pug');
	    let url = process.env.rasp_ctl_url;
	    if(!url.length)  {
		    console.log("error, invalid device address: rasp_ctl url: " + url);
		    return context.fail("internal error: invalid url");
	    }
            url = url + "/state?socket=all";
            const req = {
		    uri: url,
            };
		    
	    return request.get(req, (err, res, body) => {
			if(err) {
				console.log("failed to request device: " + err);
				return context.fail("failed to request device: " + err);
			}
		    	var buildObj = {}
			buildObj['jsonMap'] = JSON.parse(body);
		        buildObj['publicUrl'] = process.env.jarvis_public_url
		        var resp = compiledFunction({source: buildObj});
		    	return context
		    		.status(200)
		    		.headers({"Content-Type": contentType})
		    		.succeed(resp);
	    });
    }
}
