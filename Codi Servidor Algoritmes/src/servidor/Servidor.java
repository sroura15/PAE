/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servidor;

import com.mongodb.MongoClient;

/**
 *
 * @author garci
 */
public class Servidor extends Thread {

    
    @Override
    public void run(){
            MyServerSocket ss = new MyServerSocket(Coms.PORT);
            MongoClient mongo = new MongoClient(Coms.ipDB, 27017);
            DBConnect db = new DBConnect(mongo);
            Location loc = new Location(db);        
            System.out.print("Servidor encendido");
            while(true){
                MySocket s = ss.accept();
                new Ajudant(s,loc).start();        
            }
            
    }
    
    
}
