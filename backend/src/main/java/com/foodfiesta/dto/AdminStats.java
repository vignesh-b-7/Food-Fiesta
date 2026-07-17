package com.foodfiesta.dto;

import java.util.List;

public class AdminStats {

    public static class TopRestaurant {
        private String id;
        private String name;
        private int orders;
        private double revenue;

        public TopRestaurant(String id, String name, int orders, double revenue) {
            this.id = id;
            this.name = name;
            this.orders = orders;
            this.revenue = revenue;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public int getOrders() {
            return orders;
        }

        public double getRevenue() {
            return revenue;
        }
    }

    private int totalOrders;
    private int activeUsers;
    private double totalRevenue;
    private int activeRestaurants;
    private int onlineDeliveryPartners;
    private int pendingComplaints;
    private List<TopRestaurant> topRestaurants;
    private List<Integer> weeklyOrderTrend;

    public AdminStats(int totalOrders, int activeUsers, double totalRevenue, int activeRestaurants,
                       int onlineDeliveryPartners, int pendingComplaints, List<TopRestaurant> topRestaurants,
                       List<Integer> weeklyOrderTrend) {
        this.totalOrders = totalOrders;
        this.activeUsers = activeUsers;
        this.totalRevenue = totalRevenue;
        this.activeRestaurants = activeRestaurants;
        this.onlineDeliveryPartners = onlineDeliveryPartners;
        this.pendingComplaints = pendingComplaints;
        this.topRestaurants = topRestaurants;
        this.weeklyOrderTrend = weeklyOrderTrend;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public int getActiveUsers() {
        return activeUsers;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public int getActiveRestaurants() {
        return activeRestaurants;
    }

    public int getOnlineDeliveryPartners() {
        return onlineDeliveryPartners;
    }

    public int getPendingComplaints() {
        return pendingComplaints;
    }

    public List<TopRestaurant> getTopRestaurants() {
        return topRestaurants;
    }

    public List<Integer> getWeeklyOrderTrend() {
        return weeklyOrderTrend;
    }
}
