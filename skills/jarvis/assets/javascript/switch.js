document.getElementById("checkval").addEventListener("click", function(event) {    
    var url = deviceAddress + "/state"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
    		alert(this.responseText);
	} else if (this.readyState == 4 && this.status != 200) {
		alert("Failed to get state from : " + url);
	} else {
	}
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
})

document.getElementsByName("switch").forEach(function(elem) {
    elem.addEventListener("click", function(event) {
	    switchId = elem.getAttribute("id");
	    var initialVal = !elem.checked
      	    var value = elem.checked?'enable':'disable';
	    var url = deviceAddress + "/" + value + "?socket=" + switchId
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
		     document.getElementById(switchId).checked = initialVal;
		     alert("Failed to change switch state from : " + (initialVal?"enable":"disable"));
		}
	    };
	    xmlHttp.open("GET", url, true);
	    xmlHttp.send(null);
    });
})

