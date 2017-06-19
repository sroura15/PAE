/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servidor;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

/**
 *
 * @author garci
 */
public class DBConnect {
    
    MongoClient clientDB;
    public DBConnect(MongoClient mongo){
        this.clientDB = mongo;
        //System.out.println("Dentro del Server Mongo");
    }
    
    public void sendDB(String idTag, double[] position){
        
        DB nameDB = clientDB.getDB("accoo");
        DBCollection collection = nameDB.getCollection("tags");
        BasicDBObject first= new BasicDBObject("idTag",idTag);
        if(collection.findOne(first)==null){
            BasicDBObject dBObjectTag = new BasicDBObject();
            if(position.length<3){
                dBObjectTag.append("idTag", idTag);
                dBObjectTag.append("coorX", position[0]);
                dBObjectTag.append("coorY", position[1]);
                dBObjectTag.append("coorZ", 0);
                collection.insert(dBObjectTag);
            }else{
                dBObjectTag.append("idTag", idTag);
                dBObjectTag.append("coorX", position[0]);
                dBObjectTag.append("coorY", position[1]);
                dBObjectTag.append("coorX", position[2]);
                collection.insert(dBObjectTag);
            }
            
        }else{
            BasicDBObject query = new BasicDBObject().append("idTag", idTag);
            BasicDBObject dBObjectTag = new BasicDBObject();
            if(position.length<3){
                dBObjectTag.append("idTag", idTag);
                dBObjectTag.append("coorX", position[0]);
                dBObjectTag.append("coorY", position[1]);
                dBObjectTag.append("posz", 0);
                collection.update(query,dBObjectTag);
            }else{
                dBObjectTag.append("idTag", idTag);
                dBObjectTag.append("coorX", position[0]);
                dBObjectTag.append("coorY", position[1]);
                dBObjectTag.append("coorZ", position[2]);
                collection.update(query,dBObjectTag);
            }
            
        }

    }
    
    public double[] getDB(String id){
        double[] references = new double[4];
        DB nameDB = clientDB.getDB("accoo");
        DBCollection collection = nameDB.getCollection("references");
        DBCursor cursor;
        DBObject query = new BasicDBObject("referencename",id);
        //System.out.print("\n BASE DE DATOS  "+query.toString());
        cursor = collection.find(query);
        try {
	while (cursor.hasNext()) {
            int i;
            String data = cursor.next().toString();
            //System.out.print(" \ndata"+data);
            String sdata[] = data.split(",");
            System.out.print(" \nPosicion "+id+":  ");
            for(i=0; i<3;i++){
                int aux = 2;
                String x[] = sdata[aux+i].split(":");                                
                references [i] = Double.parseDouble(x[1]);
                System.out.print("  "+i+":: "+references[i]);
                
            }   
	}
        } finally {
	cursor.close();
        }
        return references;
    }
}

    

