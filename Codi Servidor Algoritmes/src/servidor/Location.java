package servidor;



import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;   
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.math3.exception.OutOfRangeException;
import org.apache.commons.math3.linear.LUDecomposition;
import org.apache.commons.math3.linear.MatrixUtils;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.SingularMatrixException;
import org.apache.commons.math3.exception.DimensionMismatchException;
import org.apache.commons.math3.ml.distance.EuclideanDistance;

public class Location {

    
protected double[][] data;
protected RealMatrix beacons;
int numeroB;
double[] posicion;
Map<String,tag> mapa;
protected Lock l;
DBConnect dbc;


    public Location( DBConnect dbc){
        this.mapa = new HashMap<>();
        String id;
        l = new ReentrantLock();
        this.dbc= dbc;
    }
    
    
    
    public void sendDataDb(String idTag, double[] position){
        dbc.sendDB(idTag,position);
    }
    
    public double[] getRef(String idRef){
        double[] ref = dbc.getDB(idRef);
        return ref;        
    }
    
    
    
    public void adddata(String idTAG, String idREF, double r, String tiempo) throws InterruptedException{
        l.lock();
    try {
        double[] referencia = getRef(idREF);
        referencia[3] =r;
        double[] pos;
        if(mapa.containsKey(idTAG)){  //si el mapa contiene este idTAG
            if(mapa.containsKey(idTAG)&&!(mapa.get(idTAG).getTiempo().equals(tiempo))){ //si no tienen el mismo tiempo
                mapa.remove(idTAG); //se borra el antiguo objeto tag y se crea uno nuevo
                mapa.put(idTAG, new tag(referencia, tiempo));
                mapa.get(idTAG).rList.add(idREF);
                new Thread() {
                    public void run() {
                        try {
                            sleep(Coms.Timeout);
                            System.out.print("\nE esperado"+Coms.Timeout);
                            if(mapa.get(idTAG).getNumeroB()>2)sendDataDb(idTAG,getPosition(idTAG));
                            mapa.remove(idTAG);
                        } catch (InterruptedException ex) {
                            Logger.getLogger(Location.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }.start();
                
                System.out.print("\nEl tag no tiene el tiempo este: "+tiempo+" Se crea un nuevo tag");
            }else{  //Si hay un idTAG y  tiene el mismo tiempo
                if(!mapa.get(idTAG).rList.contains(idREF)){  //Si no contiene este REF
                    mapa.get(idTAG).addDato(referencia);
                    mapa.get(idTAG).rList.add(idREF);                    
                }else System.out.print("\nTiene esta ref dentro");
            }
        }else{  //                                       Si no hay ningun idTAG
            mapa.put(idTAG, new tag(referencia, tiempo));
            mapa.get(idTAG).rList.add(idREF);
            new Thread() {
                @Override
                public void run() {
                    try {
                        sleep(Coms.Timeout);
                        double[] positionXYZ;
                        if(mapa.get(idTAG).getNumeroB()>2)sendDataDb(idTAG,getPosition(idTAG));
                        mapa.remove(idTAG);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(Location.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }.start();
        }
    } finally {
        l.unlock();
    }
    }
    
    public double[] getPosition(String id) throws InterruptedException{
        l.lock();
        posicion=null;
        if(mapa.get(id).getNumeroB()<2){
            System.out.print("\n\u001BSolo hay estas REFERENCIAS : "+mapa.get(id).getNumeroB());
            System.out.print("\n\u001B[31mnumeroB: "+Arrays.deepToString(mapa.get(id).getData()));
            System.out.print("\\u001B[31m      Pocas referencias");
            mapa.get(id).rList.clear();
            l.unlock();
            return null;
        }else{
            beacons = MatrixUtils.createRealMatrix(mapa.get(id).getData());
            posicion = Multilateration(beacons);
            System.out.print("\n\n\033[32mTagId:"+id+" Tiempo:"+mapa.get(id).getTiempo()+" posicion:"+Arrays.toString(posicion)
                    +"\n\033[32musando los datos: "+Arrays.deepToString(mapa.get(id).getData()));
            mapa.get(id).rList.clear();
            l.unlock();            
            return posicion;                        //enviar posicion a base de datos
        }
        
    }
    
    
		
    public static double [] Multilateration(RealMatrix beacons){
                        double p0[] = {0,0};
			double [] posicion = new double [2];
			int ref = beacons.getRowDimension();
    switch (ref) {
        case 2:
            double p2[] = {beacons.getEntry(1, 0)-beacons.getEntry(0, 0), beacons.getEntry(1, 1)-beacons.getEntry(0, 1)};
            double r1 = beacons.getEntry(0, 3);
            double r2 = beacons.getEntry(1, 3);
            double alfa;
            if(p2[1]>0){
                alfa=Math.atan((p2[1]/p2[0]));
                if(alfa<0){
                    alfa = alfa+Math.PI;
                }
            }
            else if(p2[1]==0){
                alfa=Math.PI;
            }
            else{
                alfa = Math.atan((p2[1])/(p2[0]))+Math.PI;
                if(alfa<Math.PI){
                    alfa = alfa - Math.PI;
                }
            }
            if(beacons.getEntry(0, 1)==beacons.getEntry(1, 1)){
                alfa=Math.PI;
            }
            double a[][] = {{0,0}, {p2[0],p2[1]}};
            EuclideanDistance aaa;
            aaa = new EuclideanDistance();
            double d = aaa.compute(p0, p2);
            double s = (d-(r1+r2))/2;
            if(beacons.getEntry(0, 1)==beacons.getEntry(1, 1)){
                if(beacons.getEntry(0, 0)>beacons.getEntry(1, 0)){
                    posicion[0] = (r1+s)*Math.cos(alfa)+beacons.getEntry(0, 0);
                    posicion[1] = beacons.getEntry(1, 1);
                }else{
                    posicion[0] = -(r1+s)*Math.cos(alfa)+beacons.getEntry(0, 0);
                    posicion[1] = beacons.getEntry(1, 1);
                }
            }else{
                posicion[0] = (r1+s)*Math.cos(alfa)+beacons.getEntry(0, 0);
                posicion[1] = (r1+s)*Math.sin(alfa)+beacons.getEntry(0, 1);
                return posicion;
            }
            break;
        case 3:
        {
            RealMatrix B = MatrixUtils.createRealMatrix(ref-1,2);
            RealMatrix b = MatrixUtils.createRealMatrix(ref-1,1);
            for (int i=0; i<(ref-1); i++){
                double row [] = {(beacons.getEntry(0,0)-beacons.getEntry(i+1,0)),
                    (beacons.getEntry(0,1)-beacons.getEntry(i+1,1))};
                B.setRow(i, row);
                double r = Math.pow(beacons.getEntry(0, 0), 2)- Math.pow(beacons.getEntry(i+1, 0), 2)
                        + Math.pow(beacons.getEntry(0, 1), 2)- Math.pow(beacons.getEntry(i+1, 1), 2)
                        - Math.pow(beacons.getEntry(0,3), 2) + Math.pow(beacons.getEntry(i+1, 3), 2);
                double [] row1 = {r};
                b.setRow(i,row1);
            }
            B = B.scalarMultiply(2);
            RealMatrix DT = B.transpose();
            RealMatrix BxDT= DT.multiply(B);
            //RealMatrix bxDT = b.multiply(DT);
            try{
                RealMatrix INV = new LUDecomposition(BxDT).getSolver().getInverse();
                
                RealMatrix Q = INV.multiply(DT).multiply(b);
                posicion[0] = Q.getEntry(0,0);
                posicion[1] = Q.getEntry(1,0);
                
                return posicion;
            }catch (DimensionMismatchException | OutOfRangeException | SingularMatrixException e) {
                System.out.println("\n\u001B[31m Error al hacer la inversa:  "+e.toString());
            }
            
        }
        default:
        {
            RealMatrix B = MatrixUtils.createRealMatrix(ref-1,3);
            RealMatrix b = MatrixUtils.createRealMatrix(ref-1,1);
            for (int i=0; i<(ref-1); i++){
                double row [] = {(beacons.getEntry(0,0)-beacons.getEntry(i+1,0)),
                    (beacons.getEntry(0,1)-beacons.getEntry(i+1,1)),
                    (beacons.getEntry(0,2)-beacons.getEntry(i+1,2))};
                B.setRow(i, row);
                double r = Math.pow(beacons.getEntry(0, 0), 2)- Math.pow(beacons.getEntry(i+1, 0), 2)
                         + Math.pow(beacons.getEntry(0, 1), 2)- Math.pow(beacons.getEntry(i+1, 1), 2)
                         + Math.pow(beacons.getEntry(0, 2), 2)- Math.pow(beacons.getEntry(i+1, 2), 2)
                         - Math.pow(beacons.getEntry(0, 3), 2)+ Math.pow(beacons.getEntry(i+1, 3), 2);
                double [] row1 = {r};
                b.setRow(i,row1);
            }
            B = B.scalarMultiply(2);
            RealMatrix DT = B.transpose();
            RealMatrix BxDT= DT.multiply(B);
            //RealMatrix bxDT = b.multiply(DT);
            try{
                RealMatrix INV = new LUDecomposition(BxDT).getSolver().getInverse();
                
                RealMatrix Q = INV.multiply(DT).multiply(b);
                double [] posicion3d = new double [3]; 
                posicion3d[0] = Q.getEntry(0,0);
                posicion3d[1] = Q.getEntry(1,0);
                posicion3d[2] = Q.getEntry(2,0);
                
                return posicion3d;
            }catch (DimensionMismatchException | OutOfRangeException | SingularMatrixException e) {
                System.out.println("Error al hacer la inversa:  "+e.toString());
            }
            
        }
    }
                        return null;
		}	
	
}



