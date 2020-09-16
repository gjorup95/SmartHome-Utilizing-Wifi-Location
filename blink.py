import RPi.GPIO as GPIO
import sys
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.OUT, initial=GPIO.LOW)
LED_STATE = True
def off():
    GPIO.output(11, GPIO.LOW)
    LED_STATE = False
    sleep(2)
def on():
    GPIO.output(11, GPIO.HIGH)
    LED_STATE = True
    sleep(2)
while True:
    on()
    off()

sys.stdout(LED_STATE)
sys.stdout.flush()