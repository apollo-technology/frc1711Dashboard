function checkIfEventIsReal(eventKeyGiven) {
    getJSON("https://www.thebluealliance.com/api/v2/event/"+eventKeyGiven+"?X-TBA-App-Id=frc1711:scouting-system:v01", function(err, data) {
        if (err != null) {
            return false;
        } else {
            if (data["key"]) {
            	console.log(data);
            	return true;
            } else {
            	return false;
            }
        }
    });
}

function resetDBForKey(eventKeyGiven) {
	getJSON("https://www.thebluealliance.com/api/v2/event/"+eventKeyGiven+"/teams?X-TBA-App-Id=1711:dataApp:2", function(err, data) {
        if (err != null) {
            return false;
        } else {
            var 
        }
    });
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};
