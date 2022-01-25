package socket;

import java.io.*;
import java.net.*;

public class server{
	public static void main(String[] args) {
		try{
			ServerSocket PortToListen = new ServerSocket(6060);
		}
		catch(IOException FailedToOccupyPort){
			System.out.println("Failed To open port: " + FailedToOccupyPort.toString());
		}
	}
}