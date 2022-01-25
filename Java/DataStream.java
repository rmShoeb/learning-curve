import java.io.*;

public class DataStream{
	public static void main(String[] args) {
		try{
			DataInputStream 	InputData 	= new DataInputStream();
			DataOutputStream 	OutputData 	= new DataOutputStream();
		}
		catch(Exception TryingToStreamData){
			System.out.println(TryingToStreamData.toString());
		}
	}
}