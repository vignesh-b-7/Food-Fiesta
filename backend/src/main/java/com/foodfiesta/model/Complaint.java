package com.foodfiesta.model;

import java.time.Instant;

public class Complaint {

    private String id;
    private String subject;
    private String description;
    private String category;
    private String status;
    private String userName;
    private String orderId;
    private Instant createdAt;

    public Complaint() {
    }

    public Complaint(String id, String subject, String description, String category, String status,
                      String userName, String orderId, Instant createdAt) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.category = category;
        this.status = status;
        this.userName = userName;
        this.orderId = orderId;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
