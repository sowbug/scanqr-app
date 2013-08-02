var sound = new Audio("audio/found_it.mp3");

var playSound = function() {
  sound.play();
};

// http://www.i-programmer.info/programming/graphics-and-imaging/3254-svg-javascript-and-the-dom.html
var rect = function(w, h, border_color, border_width) {
 var NS = "http://www.w3.org/2000/svg";
 var SVGObj = document.createElementNS(NS, "rect");
 SVGObj.width.baseVal.value = w;
 SVGObj.height.baseVal.value = h;
 SVGObj.setAttribute("height", h);
 SVGObj.style.fill = "none";
 SVGObj.style.stroke = border_color;
 SVGObj.style.strokeWidth = border_width;
 return SVGObj;
}

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
  var openUrlButton = document.querySelector("#open-url");
  if (/https?:\/\/.*/.test(result))
    openUrlButton.style.display = 'inline-block';
  else
    openUrlButton.style.display = 'none';

  document.querySelector("#text").innerText = result;
  showElements(false);
  playSound(false);
};

onload = function() {
  var capSize = 240;
  var vidSize = 480;
  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var scanLog = document.querySelector("#scanlog");
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;
  var viewfinderPulse = 0.5;
  var viewfinderPulseDelta = 0.1;
  var viewfinderRect = rect(capSize, capSize, "red", 3);
  viewfinderRect.x.baseVal.value = (vidSize - capSize) / 2;
  viewfinderRect.y.baseVal.value = (vidSize - capSize) / 2;

  var svg = document.querySelector("#svg");
  svg.width = vidSize;
  svg.height = vidSize;
  svg.appendChild(viewfinderRect);
  setInterval(function() {
    viewfinderPulse += viewfinderPulseDelta;
    if (viewfinderPulse >= 1.0 || viewfinderPulse <= 0.3) {
      viewfinderPulseDelta = -viewfinderPulseDelta;
    }
    viewfinderRect.style.strokeOpacity = viewfinderPulse;
  }, 100);

  start();

  canvas.width = capSize;
  canvas.height = capSize;

  var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

  qrcode.callback = finish;

  var watchdogId = null;
  function resetLogWatchdog() {
    if (watchdogId)
      clearTimeout(watchdogId);
    watchdogId = setTimeout(function() {
      scanLog.innerText = "ScanQR"; }, 5000);
  }

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
        if (e != "Couldn't find enough finder patterns") {
          scanLog.innerText = e;
          resetLogWatchdog();
        }
        setTimeout(scanSnapshot.bind(this), 250);
      }
    }
  }

  document.querySelector("#copy").onclick = function() {
    document.querySelector("#text").select();
    document.execCommand('copy', null, "");
  };

  document.querySelector("#open-url").onclick = function() {
    window.open(document.querySelector("#text").value);
  };

  document.querySelector("#scan").onclick = function() {
    start();
    scanSnapshot();
  };

  navigator.webkitGetUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    scanSnapshot();
  }, onFailSoHard);
}
