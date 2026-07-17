package com.foodfiesta.model;

public class MenuItem {

    private String id;
    private String restaurantId;
    private String name;
    private String description;
    private MenuSection section;
    private double price;
    private String imageUrl;
    private boolean veg;
    private boolean inStock;
    private boolean bestseller;

    public MenuItem() {
    }

    public MenuItem(String id, String restaurantId, String name, String description, MenuSection section,
                     double price, String imageUrl, boolean veg, boolean inStock, boolean bestseller) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.description = description;
        this.section = section;
        this.price = price;
        this.imageUrl = imageUrl;
        this.veg = veg;
        this.inStock = inStock;
        this.bestseller = bestseller;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MenuSection getSection() {
        return section;
    }

    public void setSection(MenuSection section) {
        this.section = section;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isVeg() {
        return veg;
    }

    public void setVeg(boolean veg) {
        this.veg = veg;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public boolean isBestseller() {
        return bestseller;
    }

    public void setBestseller(boolean bestseller) {
        this.bestseller = bestseller;
    }
}
