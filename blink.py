import RPi.GPIO as GPIO
import sys
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT, initial=GPIO.LOW)
def off():
    GPIO.output(7, GPIO.LOW)
    LED_STATE = False
    print(LED_STATE)
    sys.stdout.flush()
    sleep(2)
def on():
    GPIO.output(7, GPIO.HIGH)
    LED_STATE = True
    print(LED_STATE)
    sys.stdout.flush()
    sleep(2)
while True:
    on()
    off()

    

