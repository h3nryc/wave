var discoveredDevices = [];
var activeDevice = {};
$.ajaxSetup({ timeout: 4000 });
function waveFinder() {
//IP Adresses ending in 0 or 255 are not scanned, because they cannot be assigned. Therefore the scanned range is 1 - 254.
  for (i = 1; i < 254; i++) {
    //?rand="+Date.now(); is used to prevent cached data.
    $.get( "http://192.168.1."+i+":3000/api/discover/?rand="+Date.now(), function( data ) {
      if (data.device == "WaveDevice") {
        discoveredDevices.push(data);
        var posn = discoveredDevices.length -1;
        $(".devices").append("<div class='device' onclick='connect("+posn+");' ><i class='material-icons'>speaker</i><div class='devicename'>"+data.name+"</div><div class='deviceip'>"+data.ip+"</div></div>");
      }
    });
  }
}
//example command { 	"cmd": { 		"type": "tick", 		"command": "rtr_unixtime" 	} }
function sendcmd(com) {
  $.get( "http://"+activeDevice.ip+":3000/api/cmd/?c="+com+"&rand="+Date.now(), function( data ) {
  });
}
function pushconsole(input) {
  $(".console").text($(".console").text()+input+"\n");
  var textarea = document.getElementById('console');
  textarea.scrollTop = textarea.scrollHeight;
}
function loadDevice() {
  $(".app").append('<div class="page" id="device"><div class="pagename">'+activeDevice.name+'</div><br><textarea rows="20" cols="50" class="console" id="console"></textarea><br><input type="text" class="commandbox"></input><div onclick="sendcmd($('+"'.commandbox'"+').val());" class="submitbutton">Send</div></div>');
}
function connect(pos) {
  activeDevice = discoveredDevices[pos];
  poll();
  document.getElementById("init").style.display = "none";
  loadDevice();
}

function poll() {
  function timeout() {
    setTimeout(function () {
      $.get( "http://"+activeDevice.ip+":3000/api/poll/?rand="+Date.now(), function( data ) {
        for (i = 0; i < data.length; i++) {
          if (data[i].type == "cmdrtr") {
            pushconsole(data[i].value)
          }
        }
      });
        timeout();
    }, 1000);
  }
  timeout();
}
