/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servidor;

import java.util.ArrayList;
import java.util.Arrays;


/**
 * @author garci
 */
public class tag {
    private int id;
    private double[][] data;
    private int numeroB;
    private String tiempo;
    ArrayList<String> rList;
    
    public tag(double[] dato, String tiempo){
        this.tiempo=tiempo;
        this.data=new double[1][4];
        this.numeroB=data.length;
        System.arraycopy(dato, 0, this.data[0], 0, 4);
        rList = new ArrayList<>();
        
        
    }
    
    
    
    public tag(double[] dato){        
        this.data=new double[1][4];
        this.numeroB=data.length;
        System.arraycopy(dato, 0, this.data[0], 0, 4);
        rList = new ArrayList<>();
    }

    public void setTiempo(String tiempo) {
        this.tiempo = tiempo;
    }

    public String getTiempo() {
        return tiempo;
    }
    
    public tag(double[][] data){
        this.data=data;
        this.numeroB=data.length;
    }
    
    public void addDato(double[] dato){   
        añadirFila(dato);
        this.numeroB=data.length;

       
    }


    public int getId() {
        return id;
    }
    
    public void añadirFila(double[] fila){
            this.numeroB=data.length;
            int l = this.data.length;
            double[][] nadaN = new double[l+1][4];
            int i;
            for(i=0;i<l;i++){
                System.arraycopy(data[i], 0, nadaN[i], 0, 4);
            }
            this.data = new double[l+1][4];

            for(i=0;i<l;i++){
                System.arraycopy(nadaN[i], 0, this.data[i], 0, 4);
            }

            System.arraycopy(fila, 0, this.data[l], 0, 4);
            this.numeroB=this.data.length;
    }


    public int getNumeroB() {
        this.numeroB=data.length;
        return this.numeroB;
    }

    public double[][] getData() {
        return data;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setData(double[][] data) {
        this.data = data;
    }
    
}
