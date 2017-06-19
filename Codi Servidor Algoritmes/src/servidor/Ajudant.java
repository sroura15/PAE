/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servidor;


import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * 
 * @author garci
 */
public class Ajudant extends Thread {
    private MySocket s;
    private Location loc;
    
    public Ajudant(MySocket s, Location loc){
        this.s=s;
        this.loc=loc;
    }
    /*
        String data = s.readLine()  LEE linia recibida
        SIN BD            id x y r  
        CON BD    idREF idTAG t r 
    */
    @Override
    public void run(){
        
        try {
            //String lsc = s.sc.nextLine();
            String info;
            info = s.readLine();
            String[] data = info.split("\\s+");
            String id;
            String idREF = data[0];
            String idTAG = data[1];
            //String tiempo= data[2];
            String tiempo= "1";
            double r = Double.parseDouble(data[3]);
            System.out.print("\nDATOS RECIBIDOS:    idREF: "+idREF+"    idTAG "+idTAG+ " tiempo: "+tiempo+ "  R: "+r);
            //sacar datos de linia : id + X Y R 
            s.socket.close();
            if(r>Coms.dMAX||r<=0){
                System.out.print("descartada");
                return;
            }
            try {
                loc.adddata(idTAG,idREF,r,tiempo);
            } catch (InterruptedException ex) {
                Logger.getLogger(Ajudant.class.getName()).log(Level.SEVERE, null, ex);
            }
            
            

        } catch (IOException ex) {
            System.out.print("error");
            Logger.getLogger(Ajudant.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        
        //String a =sc.next();
        //xaid = sc.nextLine();
        //loc.adddata(id,data);
           
        }
    }

