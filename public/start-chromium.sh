#!/bin/bash
id=#1

myhost="https://trees.connectedexeter.uk:8443/node.html${id}"

#extra_opts="--kiosk --disable-infobars"
extra_opts=""
options="--disable-session-crashed-bubble --no-first-run --allow-running-insecure-content --allow-insecure-localhost --disable-popup-blocking"

# if you remove all the profile, you'll have to reenable the camera and mic in the browser
#rm -rf /home/pi/.config/chromium/

# this is for bad crashes, which leave a lock handing round
rm -f /home/pi/.config/chromium/SingletonLock

# run the server
#sudo .... &

sleep 1

# run the browser
export DISPLAY=:0.0
/usr/bin/chromium-browser ${extra_opts} ${options} ${myhost} &
echo $! >chromium-browser.pid
