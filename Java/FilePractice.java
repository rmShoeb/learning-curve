import java.io.*;

public class FilePractice{
	public static void main(String[] args) {
		try{
			FileInputStream 	InputFileVariable 	= new FileInputStream("exaple.txt");
			FileOutputStream 	OutputFileVariable 	= new FileOutputStream("output.txt", true);
			int 				data 				= InputFileVariable.read();
			char 				h 					= 'h';
			String 				str 				= "\nJust a string";

			while(data != -1){
				System.out.println(data);
				data = InputFileVariable.read();
			}

			try{
				OutputFileVariable.write(h);
				OutputFileVariable.write(str.getBytes());
			}
			catch(Exception TryingToWriteToFile){
				System.out.println(TryingToWriteToFile.toString());
			}


			InputFileVariable.close();
			OutputFileVariable.close();
		}
		catch(Exception TryingToReadWriteFromFile){
			System.out.println(TryingToReadWriteFromFile.toString());
		}
	}
}