# P2P Project 2020
Instructions:
1. git clone https://gitlab.au.dk/au564192/p2p-project-2020.git
2. git fetch
3. git checkout milestone3client
4. sudo npm install
5. Setup of device - primary connection string: HostName=GjorupHub.azure-devices.net;DeviceId=guestdevice;SharedAccessKey=uu9Jm22zFM7if6zva6gsxNFGTBEZLY3Dt+m6XEJxDEk=
6. Replace const deviceConnectionString in sensorClient.js with primary connection string listed above.
7. sudo node server.js

# Website interaction
Access to website http://20.54.91.188:10503/

# GPIO:
LED1 GPIO = 17  \
LED2 GPIO = 2  \
LED3 GPIO = 22  \
Humidity/temp GPIO = 4  \
Trigger GPIO = 23  \
Echo GPIO = 24  

# Docker
1. docker pull gjorup95/milestone3client
2. sudo docker run --rm -it -p 10503:10503 --privileged gjorup95/milestone3client:latest

# Issues
1. ledsPlugin.js does not properly update the physical state of all 3 connected leds, it simply updates the resources of the leds beyond the first.