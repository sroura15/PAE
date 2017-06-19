package servidor;

import java.net.*;
import java.io.*;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MySocket {
	
    protected Socket socket;
    protected BufferedReader in;
    protected PrintWriter out;
    protected Scanner sc;

    public MySocket(String host, int port) {
        try {
            socket = new Socket(host, port);
            initStreams();
        } catch (IOException e) {
        }
    }

    public MySocket(Socket s) {
        socket = s;
        initStreams();
    }
    
    private void initStreams() {
        try {
            sc = new Scanner(socket.getInputStream());
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            out = new PrintWriter(socket.getOutputStream(), true);
            
        } catch (IOException e) {
        }
    }
    
    public void println(String s){
        out.println(s);
    } 
    
    public String readLine(){
        try {
            return in.readLine();
        } catch (IOException ex) {
            Logger.getLogger(MySocket.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

}
