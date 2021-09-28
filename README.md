# icuween

Fullscreen WebGL eyeball that looks around, good for a Halloween costume!

Demonstrates: 

* Offline Web Apps with service-worker.js Caching
* Mobile Web App (Add to Homescreen) with manifest.json
* Simple Three.js 

# Deploy

gcloud app deploy -q --project eyeseeyouween --version 1 --verbosity=info app.yaml

# Online Example

https://eyeseeyouween.appspot.com (best on mobile)

# Projector stuff on a Raspberry Pi 3b

1. Enable 'Fake KMS' GL Desktop driver
2. Launch in kiosk: `/usr/bin/chromium-browser --kiosk  https://eyeseeyouween.appspot.com/`
3. sudo nano  /etc/xdg/lxsession/LXDE-pi/autostart
4. https://diyprojects.io/open-html-page-starting-raspberry-pi-os-chromium-browser-full-screen-kiosk-mode/#.YU1pU3zMLOQ
5. https://raspberrypi.stackexchange.com/questions/752/how-do-i-prevent-the-screen-from-going-blank
6. sudo apt-get install unclutter
7. HDMI Mode from https://www.raspberrypi.org/documentation/computers/config_txt.html
