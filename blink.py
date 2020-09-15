import RPi.GPIO as GPIO
import sys
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT, initial=GPIO.LOW)
LED_STATE = False
while True:
    GPIO.OUTPUT(7, GPIO.HIGH)
    LED_STATE = True
    print(LED_STATE)
    sleep(1)
    GPIO.OUTPUT(7, GPIO.LOW)
    LED_STATE = False
    print(LED_STATE)
    sleep(1)
    sys.stdout.flush()