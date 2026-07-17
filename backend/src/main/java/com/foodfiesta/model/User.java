package com.foodfiesta.model;

public class User {

    private String id;
    private String name;
    private String email;
    private Role role;
    private String defaultAddress;

    public User() {
    }

    public User(String id, String name, String email, Role role, String defaultAddress) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.defaultAddress = defaultAddress;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDefaultAddress() {
        return defaultAddress;
    }

    public void setDefaultAddress(String defaultAddress) {
        this.defaultAddress = defaultAddress;
    }
}
