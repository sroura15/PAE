import serial
import socket

arduino= serial.Serial('/dev/ttyACM0' , 9600)
while True:
    a=arduino.readline()
    s=socket.socket()
    s.connect(("169.254.139.148", 8888))
    s.send(a)
    s.close()
arduino.close() 

    
