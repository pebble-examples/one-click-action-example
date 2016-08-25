Pebble.addEventListener('ready', function(e) {
  Pebble.sendAppMessage({'APP_READY': true});
});

Pebble.addEventListener('appmessage', function(dict) {
  if(dict.payload['LOCK_UUID'] && dict.payload['ACCESS_TOKEN']) {
    toggleLockitronState(dict.payload['LOCK_UUID'], dict.payload['ACCESS_TOKEN']);
  }
});

function toggleLockitronState(lock_uuid, access_token) {
  var url = 'https://api.lockitron.com/v2/locks/' + lock_uuid +
              '?access_token=' + access_token;
  var json = {'state': 'toggle'};

  xhrWrapper(url, 'put', json, function(req) {
    if(req.status == 200) {
      sendResultToPebble(JSON.parse(req.response));
    }
  });

}

function sendResultToPebble(json) {
  if(json.state) {
    var lockState = json.state == 'lock' ? 1 : 0;
    Pebble.sendAppMessage({
      'LOCK_STATE': lockState
    });
  }
}

function xhrWrapper(url, type, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(xhr);
  };
  xhr.open(type, url);
  if(data) {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send();
  }
}
