package com.foodfiesta.dto;

import java.util.List;
import java.util.Map;

public class SalesSummary {

    private int totalOrders;
    private double totalRevenue;
    private double avgOrderValue;
    private Map<String, Long> ordersByStatus;
    private List<Double> last7DaysRevenue;

    public SalesSummary(int totalOrders, double totalRevenue, double avgOrderValue, Map<String, Long> ordersByStatus,
                         List<Double> last7DaysRevenue) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.avgOrderValue = avgOrderValue;
        this.ordersByStatus = ordersByStatus;
        this.last7DaysRevenue = last7DaysRevenue;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public double getAvgOrderValue() {
        return avgOrderValue;
    }

    public Map<String, Long> getOrdersByStatus() {
        return ordersByStatus;
    }

    public List<Double> getLast7DaysRevenue() {
        return last7DaysRevenue;
    }
}
