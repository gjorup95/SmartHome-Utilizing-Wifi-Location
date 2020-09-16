import RPi.GPIO as GPIO
import sys
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT, initial=GPIO.LOW)
LED_STATE = False
def blink():
    while True:
        GPIO.output(7, GPIO.HIGH)
        LED_STATE = True
        sleep(1)
        GPIO.output(7, GPIO.LOW)
        LED_STATE = False
        sleep(1)
        return LED_STATE
print(blink())
sys.stdout.flush()