/*
 DW1000 ranging demo on radino32 dw1000 modules
 optimized for spiders antenna (DW1000Ranging.h)
 2016 In-Circuit GmbH
 based on the DW1000 library by Thomas Trojer
*/

#include <stm32/l1/iwdg.h>
#include <SPI.h> 
#include "DW1000Ranging.h"
#include "DW1000Device.h" 

//Set to 1 for the ANCHOR. Else it is a TAG.
//If set to 2 the Pin PIN_READMODE selects mode at bootup. (Pull low for ANCHOR) 
//One ANCHOR can handle up to 6 TAGS. The TAGs need individual short addresses.
#define WE_ARE_ANCHOR      0
#define PIN_READMODE      A1

//Short address used for packet addressing
#define MY_SHORT_ADDRESS   0x8888

//set tx power in dBm, 0 to 33.5, step 0.5
//Respect you local wireless regulations!
//#define DW_TX_POWER      33.5

//If set to 1, the Anchor regularly prints out a table of known devices.
//Else it prints every ranging event seperately
#define PRINT_DEVICE_TABLE  1

//LED toggles on successful measurement. Set to 0xFF to deactivate functionality.
#define PIN_LED 13

//Where to printout information
#define SerialOut if(Serial)Serial
#define SerialOutBegin() Serial.begin()

//Here you can set actions to execute when a Tag gets near an Anchor
//MODULE_NEAR_INIT : Executed during setup()
//MODULE_NEAR_ON : Executed when any tag is nearer than MODULE_NEAR_VALUE meters for at least MODULE_NEAR_TIMEOUT ms
//MODULE_NEAR_OFF : Executed when no tag is nearer than MODULE_NEAR_VALUE meters
#define MODULE_NEAR_VALUE    1.0
#define MODULE_NEAR_TIMEOUT  300
#if 0
  #define MODULE_NEAR_INIT() do{ pinMode(22,OUTPUT); }while(0)
  #define MODULE_NEAR_ON() do{ digitalWrite(22,HIGH); }while(0)
  #define MODULE_NEAR_OFF() do{ digitalWrite(22,LOW); }while(0)
#else
  #define MODULE_NEAR_INIT() do{}while(0)
  #define MODULE_NEAR_ON() do{}while(0)
  #define MODULE_NEAR_OFF() do{}while(0)
#endif

bool weAreAnchor = false;

bool TX = true;
long transMode;
long restMode;
long TXtime;
long RTtime;
long tAccel;

int ax, ay, az;
int ax_, ay_, az_;
int incX, incY, incZ;


void setup() {
  pinMode(32, OUTPUT);   //Wakeup=low
  digitalWrite(32, LOW);
  
  pinMode(A0, INPUT_ANALOG);
  pinMode(A1, INPUT_ANALOG);
  pinMode(A2, INPUT_ANALOG);
  
  if(PIN_LED!=0xFF) pinMode(PIN_LED,OUTPUT);
  if(PIN_LED!=0xFF) digitalWrite(PIN_LED,LOW);
  if (WE_ARE_ANCHOR==2) pinMode(PIN_READMODE, INPUT_PULLUP);
  
  MODULE_NEAR_INIT();
  
  SerialOutBegin();
  Serial.begin(9600);
  delay(1000);
  iwdg_start();
  
  #if WE_ARE_ANCHOR==2
    weAreAnchor = !digitalRead(PIN_READMODE);
  #else
    weAreAnchor = (WE_ARE_ANCHOR==1);
  #endif
  
  //init the configuration
  DW1000Ranging.initCommunication();
  DW1000Ranging.attachNewRange(newRange);
  
  if (weAreAnchor) {
    //Start the module as tag since the library switched naming.
    DW1000Ranging.startAsAnchor("7D:00:22:EA:82:60:0B:9C", DW1000.MODE_IN_CIRCUIT_1, MY_SHORT_ADDRESS);
  } 
  else {
    //Start the module as anchor since the library switched naming.
    DW1000Ranging.startAsTag("7D:00:22:EA:82:60:0B:9C", DW1000.MODE_IN_CIRCUIT_1, MY_SHORT_ADDRESS);
  }
  
  #ifdef DW_TX_POWER
    DW1000.setManualTxPower(DW_TX_POWER);
  #endif
}

void loop()
{   
  iwdg_reset();
  
  //We define the pins that read the analog 
  //values from the accelerometer.
  ax=analogRead(A0);
  ay=analogRead(A1);
  az=analogRead(A2);
  
  //With these we compute the difference between the last
  //value from the accelerometer and the actual one.
  //If incX, incY, or incZ are big enough, it means
  //that the tag moved.
  incX=ax_-ax;
  incY=ay_-ay;
  incZ=az_-az;
  
  //During this time, the tag communicates 
  //with the reference.
  TXtime=3000;
  
  //TX is a boolean that indicates if the tag is 
  //transmitting (true) or not (false).
  //If it is true, the DW1000Ranging.loop() will be 
  //executed. 
  if(TX)
  {
    DW1000Ranging.loop();
  }
  
  //If the tag was transmitting and transmission time 
  //has been exceed, the TX changes and the tag stops 
  //transmitting. 
  //The counter for the rest time starts.
  if(TX && (millis()-transMode)>TXtime)
  {
    TX=!TX;
    restMode=millis();
  }
  
  //If the tag wasn't transmitting and the rest 
  //time has been exceed, the TX changes and the 
  //tag starts transmitting. 
  //The counter for the transmission time starts.
  else if(!TX && (millis()-restMode)>RTtime)
  {
    TX=!TX;
    transMode=millis();
  }    
  
  //With this condition the tag will know if the 
  //accelerometer has detected motion or not. 
  //We set the minimum value for motion detection
  //to 50 because we did some testing and found it
  //a good value.
  //The tAccel starts when the motion is detected. 
  if((incX)>50 || (incY)>50 || (incZ)>50)
  {
    RTtime=3000;
    tAccel=millis();
  }
  
  //While the tAccel hasn't been exceeded, the
  //tag will act the same way as if the accelerometer
  //was detecting motion.
  else if((millis()-tAccel)<15000)
  {
    RTtime=3000;
  }
  
  //When the tAccel has been exceed and the accelerometer
  //is not detecting motion, the rest time increases from
  //3 seconds to 10 seconds. 
  else
  {
    RTtime=10000;
  }  

  //We save the analog values from the accelerometer to
  //compare them with the ones that will be received in
  //the next loop.  
  ax_=ax;
  ay_=ay;
  az_=az;
} 

void newRange()
{
  if(PIN_LED!=0xFF) digitalWrite(PIN_LED,!digitalRead(PIN_LED)); 
}
