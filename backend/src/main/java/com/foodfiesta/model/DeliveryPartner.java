package com.foodfiesta.model;

public class DeliveryPartner {

    private String id;
    private String name;
    private String vehicle;
    private double rating;
    private boolean online;
    private String activeOrderId;
    private double baseEarnings;
    private double incentiveEarnings;
    private double tipEarnings;
    private int completedDeliveries;

    public DeliveryPartner() {
    }

    public DeliveryPartner(String id, String name, String vehicle, double rating, boolean online,
                            double baseEarnings, double incentiveEarnings, double tipEarnings, int completedDeliveries) {
        this.id = id;
        this.name = name;
        this.vehicle = vehicle;
        this.rating = rating;
        this.online = online;
        this.baseEarnings = baseEarnings;
        this.incentiveEarnings = incentiveEarnings;
        this.tipEarnings = tipEarnings;
        this.completedDeliveries = completedDeliveries;
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

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public String getActiveOrderId() {
        return activeOrderId;
    }

    public void setActiveOrderId(String activeOrderId) {
        this.activeOrderId = activeOrderId;
    }

    public double getBaseEarnings() {
        return baseEarnings;
    }

    public void setBaseEarnings(double baseEarnings) {
        this.baseEarnings = baseEarnings;
    }

    public double getIncentiveEarnings() {
        return incentiveEarnings;
    }

    public void setIncentiveEarnings(double incentiveEarnings) {
        this.incentiveEarnings = incentiveEarnings;
    }

    public double getTipEarnings() {
        return tipEarnings;
    }

    public void setTipEarnings(double tipEarnings) {
        this.tipEarnings = tipEarnings;
    }

    public double getTotalEarnings() {
        return baseEarnings + incentiveEarnings + tipEarnings;
    }

    public int getCompletedDeliveries() {
        return completedDeliveries;
    }

    public void setCompletedDeliveries(int completedDeliveries) {
        this.completedDeliveries = completedDeliveries;
    }
}
