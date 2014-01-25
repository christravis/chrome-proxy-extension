$(document).ready(function(){
	chrome.runtime.sendMessage({ msg: "status" }, function(response){
		updateState(response.state);
	});

	$('#onoff').click(function(){
		if (this.disabled) return;
		chrome.runtime.sendMessage({ msg: "switchState" }, function(response){
			updateState(response.state);
		});
	});
});

function updateState (state) {
	var b = document.getElementById('onoff');
	if (!b) return;
	b.disabled = false;
	if (state == "on") {
		b.innerHTML = 'Switch OFF';
		$('#onoff').addClass('on');
	} else {
		b.innerHTML = 'Switch ON';
		$('#onoff').removeClass('on');
	}
}