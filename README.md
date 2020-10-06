# P2P Project 2020
Instructions:
1. git clone https://gitlab.au.dk/au564192/p2p-project-2020.git
2. git fetch
3. git checkout milestone3/server
4. sudo npm install
5. sudo node server.js

# Website interaction
Access to website http://20.54.91.188:10503/
1. Humidity & temperature is shown and updated on the graph.
2. Actuators (LEDS) are receiving randomize updates every 6th second.
3. Distance of the ultrasonic sensor is shown and updated.


# Docker
1. docker pull gjorup95/milestone3server
2. sudo docker run --rm -it -p 10503:10503 --privileged gjorup95/milestone3:latest
