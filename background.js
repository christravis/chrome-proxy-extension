// Switch the proxy on by default
if (!localStorage['state']) {
	localStorage['state'] = "on";
}

var initialProxySettings = null;
chrome.proxy.settings.get(
	{'incognito': false},
	function(config) {
		console.log(config);
		if (config.levelOfControl != "controllable_by_this_extension" && config.levelOfControl != "controlled_by_this_extension") {
			throw new Exception("The extension is not able to make changes to your proxy settings!: " + config.levelOfControl);
		}
		initialProxySettings = config;
	}
);

var setProxySettings = function(){
	if (localStorage['state'] == "on") {
		// Setup proxy
		chrome.proxy.settings.set({
			"scope": "regular",
			"value": {
				"mode": "pac_script",
				"pacScript": {
					"data":
						"function FindProxyForURL(url, host) {\n" +
						"	if (dnsDomainIs(host, '.test.com'))\n" +
						"		return 'PROXY 192.168.1.1:8888';\n" +
						"	return 'DIRECT';\n" +
						"}"
				}
			}
		});
	} else {
		// Use default settings
		chrome.proxy.settings.set({
			"scope": "regular",
			//"value": initialProxySettings.value
			"value": {
				"mode": "system"
			}
		});
	}
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.msg && request.msg == "switchState") {
		localStorage['state'] = localStorage['state'] == "on" ? "off" : "on";
		setProxySettings();
	}
	sendResponse({ state: localStorage['state'] });
});