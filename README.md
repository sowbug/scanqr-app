scanqr
======

A Chrome Packaged App that scans QR codes.

NOTE: Seems to work well only on notebook/Chromebook computers, which
have webcams that have very short-range focus by default.
getUserMedia() today doesn't allow the app to specify the focus, so
that means you get whatever the default is. On an iMac, this means
you need a very large (over one foot wide) QR code to hold up in
front of the webcam at a "normal" distance of probably 2-3 feet,
which is ridiculous.

Credits
=======

* The real brains in this app are in https://github.com/LazarSoft/jsqrcode, which is in turn a port of http://code.google.com/p/zxing. Thanks, everyone!
* The bloop-bloop sound is floating around on the web with an unclear origin.
* Parts of the app skeleton are from http://www.html5rocks.com/. Thanks in particular to [Eric Bidelman](https://github.com/ebidel).
