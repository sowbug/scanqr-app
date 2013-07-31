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