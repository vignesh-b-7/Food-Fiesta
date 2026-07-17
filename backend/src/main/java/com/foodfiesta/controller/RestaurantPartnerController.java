package com.foodfiesta.controller;

import com.foodfiesta.dto.MenuItemRequest;
import com.foodfiesta.dto.SalesSummary;
import com.foodfiesta.model.MenuItem;
import com.foodfiesta.model.MenuSection;
import com.foodfiesta.model.Order;
import com.foodfiesta.model.OrderStatus;
import com.foodfiesta.service.MenuService;
import com.foodfiesta.service.OrderService;
import com.foodfiesta.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * Mutation endpoints used by the Restaurant Partner portal: menu CRUD and a
 * lightweight sales summary computed from the in-memory order list.
 */
@RestController
@RequestMapping("/api/restaurants/{restaurantId}")
public class RestaurantPartnerController {

    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final OrderService orderService;

    public RestaurantPartnerController(RestaurantService restaurantService, MenuService menuService, OrderService orderService) {
        this.restaurantService = restaurantService;
        this.menuService = menuService;
        this.orderService = orderService;
    }

    @PostMapping("/menu")
    public MenuItem addItem(@PathVariable String restaurantId, @RequestBody MenuItemRequest request) {
        restaurantService.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found: " + restaurantId));
        MenuItem item = toMenuItem(request);
        return menuService.addItem(restaurantId, item);
    }

    @PutMapping("/menu/{itemId}")
    public MenuItem updateItem(@PathVariable String restaurantId, @PathVariable String itemId, @RequestBody MenuItemRequest request) {
        MenuItem item = toMenuItem(request);
        return menuService.updateItem(itemId, item)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found: " + itemId));
    }

    @PatchMapping("/menu/{itemId}/stock")
    public MenuItem toggleStock(@PathVariable String restaurantId, @PathVariable String itemId) {
        return menuService.toggleStock(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found: " + itemId));
    }

    @DeleteMapping("/menu/{itemId}")
    public Map<String, Boolean> deleteItem(@PathVariable String restaurantId, @PathVariable String itemId) {
        boolean removed = menuService.deleteItem(itemId);
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found: " + itemId);
        }
        return Map.of("deleted", true);
    }

    @GetMapping("/orders")
    public List<Order> restaurantOrders(@PathVariable String restaurantId) {
        return orderService.findByRestaurant(restaurantId);
    }

    @GetMapping("/sales-summary")
    public SalesSummary salesSummary(@PathVariable String restaurantId) {
        List<Order> orders = orderService.findByRestaurant(restaurantId);
        double totalRevenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(Order::getTotalAmount)
                .sum();
        int totalOrders = orders.size();
        double avgOrderValue = totalOrders == 0 ? 0 : orders.stream().mapToDouble(Order::getTotalAmount).sum() / totalOrders;

        Map<String, Long> byStatus = new java.util.LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = orders.stream().filter(o -> o.getStatus() == status).count();
            byStatus.put(status.name(), count);
        }

        int seed = Math.abs(restaurantId.hashCode());
        List<Double> weekly = List.of(
                round(totalRevenue * 0.08 + (seed % 40)),
                round(totalRevenue * 0.11 + (seed % 55)),
                round(totalRevenue * 0.09 + (seed % 30)),
                round(totalRevenue * 0.15 + (seed % 60)),
                round(totalRevenue * 0.18 + (seed % 45)),
                round(totalRevenue * 0.21 + (seed % 70)),
                round(totalRevenue * 0.18 + (seed % 50))
        );

        return new SalesSummary(totalOrders, round(totalRevenue), round(avgOrderValue), byStatus, weekly);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private MenuItem toMenuItem(MenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setSection(MenuSection.valueOf(request.getSection().toUpperCase()));
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setVeg(request.isVeg());
        item.setInStock(request.isInStock());
        item.setBestseller(request.isBestseller());
        return item;
    }
}
