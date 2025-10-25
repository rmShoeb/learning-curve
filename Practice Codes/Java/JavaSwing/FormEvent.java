import java.util.EventObject;

public class FormEvent extends EventObject{
	private static final long serialVersionUID = 1L;
	private String name;
	private String occupation;
	private String age;
	
	public FormEvent(Object source) {
		super(source);
	}
	
	public FormEvent(Object source, String name, String occupation, String age) {
		super(source);
		this.name = name;
		this.occupation = occupation;
		this.setAge(age);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	/**
	 * @return the age
	 */
	public String getAge() {
		return age;
	}

	/**
	 * @param age the age to set
	 */
	public void setAge(String age) {
		this.age = age;
	}

}
