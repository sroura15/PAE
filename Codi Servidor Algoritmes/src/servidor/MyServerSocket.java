package servidor;

import java.net.*;
import java.io.*;

public class MyServerSocket {
	
    protected ServerSocket serverSocket;

    public MyServerSocket(int port) {
        try {
            serverSocket = new ServerSocket(port);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public MySocket accept() {
        try {
            Socket cs = serverSocket.accept();
            return new MySocket(cs);
        } catch (IOException e) {
            return null;
        }
    }

}
