package com.foodfiesta.dto;

import com.foodfiesta.model.Restaurant;
import com.foodfiesta.model.RestaurantStatus;

public class RestaurantSummary {

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
    private int menuItemCount;

    public RestaurantSummary(Restaurant restaurant, int menuItemCount) {
        this.id = restaurant.getId();
        this.name = restaurant.getName();
        this.cuisine = restaurant.getCuisine();
        this.rating = restaurant.getRating();
        this.deliveryTimeMinutes = restaurant.getDeliveryTimeMinutes();
        this.imageUrl = restaurant.getImageUrl();
        this.address = restaurant.getAddress();
        this.status = restaurant.getStatus();
        this.pureVeg = restaurant.isPureVeg();
        this.avgCostForTwo = restaurant.getAvgCostForTwo();
        this.menuItemCount = menuItemCount;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCuisine() {
        return cuisine;
    }

    public double getRating() {
        return rating;
    }

    public int getDeliveryTimeMinutes() {
        return deliveryTimeMinutes;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAddress() {
        return address;
    }

    public RestaurantStatus getStatus() {
        return status;
    }

    public boolean isPureVeg() {
        return pureVeg;
    }

    public double getAvgCostForTwo() {
        return avgCostForTwo;
    }

    public int getMenuItemCount() {
        return menuItemCount;
    }
}
