package com.model;

public class StudentModel {
    private Integer id;
    private String name;
    private String roll;
    private String gender;
    private String year;
    private String semester;
    private String address;
    private String picture;

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
    public String getRoll() {
        return roll;
    }
    public void setRoll(String roll) {
        this.roll = roll;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getYear() {
        return year;
    }
    public void setYear(String year) {
        this.year = year;
    }
    public String getSemester() {
        return semester;
    }
    public void setSemester(String semester) {
        this.semester = semester;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getPicture() {
        return picture;
    }
    public void setPicture(String picture) {
        this.picture = picture;
    }
    @Override
    public String toString() {
        return "StudentModel [id=" + id + ", name=" + name + ", roll=" + roll + ", gender=" + gender + ", year=" + year
                + ", semester=" + semester + ", address=" + address + ", picture=" + picture + "]";
    }
}
