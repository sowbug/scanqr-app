var sound = new Audio("audio/found_it.mp3");

var playSound = function() {
  sound.play();
};

var showElements = function(is_scan) {
  var elements = document.querySelectorAll(".show-on-success");
  for (var e = 0; e < elements.length; ++e) {
    var el = elements[e];
    if (is_scan) {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';      
    }
  }
  elements = document.querySelectorAll(".show-on-scan");
  for (var e = 0; e < elements.length; ++e) {
    var el = elements[e];
    if (is_scan) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';      
    }
  }
};

var start = function() {
  showElements(true);
};

var finish = function(result) {
  document.querySelector("#text").innerText = result;
  showElements(false);
  playSound(false);
};

onload = function() {
  var capSize = 240;
  var vidSize = 480;
  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  start();

  canvas.width = capSize;
  canvas.height = capSize;

  var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

  qrcode.callback = finish;

  function scanSnapshot() {
    if (localMediaStream) {
      var mid = vidSize >> 1;
      var capHalf = capSize >> 1;
      ctx.drawImage(video,
        mid + 32, mid - capHalf, capSize, capSize,
        0, 0, capSize, capSize);
      try {
        qrcode.decode();
      } catch (e) {
        console.log(e);
        setTimeout(scanSnapshot.bind(this), 250);
      }
    }
  }

  document.querySelector("#again").onclick = function() {
    start();
    scanSnapshot();
  };

  document.querySelector("#copy").onclick = function() {
    document.querySelector("#text").select();
    document.execCommand('copy', null, "");
  };

  navigator.webkitGetUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    scanSnapshot();
  }, onFailSoHard);
}
