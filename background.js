chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
    'id': 'scanqr',
    'width': 480,
    'height': 480
  });
});
