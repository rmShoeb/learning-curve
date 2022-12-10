package com.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.Part;

public class Util {
    private static final String path = "D:\\learning-phase\\assignment\\studentinfo\\src\\main\\webapp\\images";

    public static String getPath() {
        return path;
    }

    public static String SaveImage(Part filePart) {
        final String fileName = filePart.getSubmittedFileName();
        OutputStream out = null;
        InputStream filecontent = null;

        try {
            out = new FileOutputStream(new File(path + File.separator + fileName));
            filecontent = filePart.getInputStream();

            int read = 0;
            final byte[] bytes = new byte[1024];

            while ((read = filecontent.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            out.flush();
            out.close();
        } catch (Exception e) {
            System.out.println(e);
        }

        return fileName;
    }
}
