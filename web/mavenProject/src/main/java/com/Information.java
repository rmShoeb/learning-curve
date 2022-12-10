package com;

public class Information {
	private Integer id;
	private String name;
	private String rating;
	
	public Information(Integer id, String name, String rating) {
		this.id = id;
		this.name = name;
		this.rating = rating;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRating() {
		return rating;
	}

	public void setRating(String rating) {
		this.rating = rating;
	}
	
	@Override
	public String toString() {
		return "Information [id=" + id + ", name=" + name + ", rating=" + rating + "]";
	}
}
