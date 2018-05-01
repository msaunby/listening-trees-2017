#!/usr/bin/python

import RPi.GPIO as GPIO
import sys
import time
import os


# Prepare push-button interface
button_pin = 23
GPIO.setmode(GPIO.BCM)
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)#Button to GPIO23

def readButton():
    ''' Returns True or False reflecting push button state.
    True is open, False is closed.
    '''
    return GPIO.input(23)


while True:
    print( "button on pin " + str(button_pin) + " reads " + str(readButton())
    time.sleep(1.5)
