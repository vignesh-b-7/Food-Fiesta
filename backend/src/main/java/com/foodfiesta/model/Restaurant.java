package com.foodfiesta.model;

public class Restaurant {

    private String id;
    private String name;
    private String cuisine;
    private double rating;
    private int deliveryTimeMinutes;
    private String imageUrl;
    private String address;
    private RestaurantStatus status;
    private boolean pureVeg;
    private double avgCostForTwo;

    public Restaurant() {
    }

    public Restaurant(String id, String name, String cuisine, double rating, int deliveryTimeMinutes,
                       String imageUrl, String address, RestaurantStatus status, boolean pureVeg, double avgCostForTwo) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.rating = rating;
        this.deliveryTimeMinutes = deliveryTimeMinutes;
        this.imageUrl = imageUrl;
        this.address = address;
        this.status = status;
        this.pureVeg = pureVeg;
        this.avgCostForTwo = avgCostForTwo;
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

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getDeliveryTimeMinutes() {
        return deliveryTimeMinutes;
    }

    public void setDeliveryTimeMinutes(int deliveryTimeMinutes) {
        this.deliveryTimeMinutes = deliveryTimeMinutes;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public RestaurantStatus getStatus() {
        return status;
    }

    public void setStatus(RestaurantStatus status) {
        this.status = status;
    }

    public boolean isPureVeg() {
        return pureVeg;
    }

    public void setPureVeg(boolean pureVeg) {
        this.pureVeg = pureVeg;
    }

    public double getAvgCostForTwo() {
        return avgCostForTwo;
    }

    public void setAvgCostForTwo(double avgCostForTwo) {
        this.avgCostForTwo = avgCostForTwo;
    }
}
