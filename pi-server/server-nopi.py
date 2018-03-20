#!/usr/bin/python
from bottle import run, route, request, response
import subprocess
#import RPi.GPIO as GPIO
import sys
import time
import os


# Prepare push-button interface
#GPIO.setmode(GPIO.BCM)
#GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP)#Button to GPIO23

def readButton():
    ''' Returns True or False reflecting push button state.
    '''
    #return GPIO.input(23)
    return True

# http://stackoverflow.com/questions/10125881/send-a-message-from-javascript-running-in-a-browser-to-a-windows-batch-file
# e.g. curl --data 'command=left' -X POST http://localhost:8080/

@route('/', method=['OPTIONS', 'POST'])
def index():

    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

    command = "none"
    reply = ""

    if request.method == 'POST':
      command = request.POST['command']
      print( command )
      if(command):
        if(command == "button"):
          if readButton:
              reply = "button-down"
          else:
              reply = "button-up"

# system control

        if(command == "halt"):
          arduino_command = GESTURE_LEAVING
          time.sleep(5)
          result = os.system("sudo halt")
        if(command == "reboot"):
          arduino_command = GESTURE_LEAVING
          time.sleep(5)
          result = os.system("sudo reboot")


    response.set_header('Access-Control-Allow-Origin', '*')
    if reply:
        result = "ok: "+reply
    else:
        result = "ok: "+command
    return result

run(host='localhost', port=8080, reloader=True)
