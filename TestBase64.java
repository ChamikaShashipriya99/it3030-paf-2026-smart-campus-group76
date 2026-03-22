import java.util.Base64;

public class TestBase64 {
    public static void main(String[] args) {
        try {
            byte[] bytes = Base64.getDecoder().decode("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
            System.out.println("Len: " + bytes.length);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
