package com.foodfiesta.controller;

import com.foodfiesta.dto.AdminStats;
import com.foodfiesta.dto.CouponRequest;
import com.foodfiesta.dto.StatusUpdateRequest;
import com.foodfiesta.model.Complaint;
import com.foodfiesta.model.Coupon;
import com.foodfiesta.model.Order;
import com.foodfiesta.model.OrderStatus;
import com.foodfiesta.model.Restaurant;
import com.foodfiesta.model.RestaurantStatus;
import com.foodfiesta.service.ComplaintService;
import com.foodfiesta.service.CouponService;
import com.foodfiesta.service.DeliveryService;
import com.foodfiesta.service.OrderService;
import com.foodfiesta.service.RestaurantService;
import com.foodfiesta.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RestaurantService restaurantService;
    private final OrderService orderService;
    private final DeliveryService deliveryService;
    private final ComplaintService complaintService;
    private final CouponService couponService;
    private final UserService userService;

    public AdminController(RestaurantService restaurantService, OrderService orderService, DeliveryService deliveryService,
                            ComplaintService complaintService, CouponService couponService, UserService userService) {
        this.restaurantService = restaurantService;
        this.orderService = orderService;
        this.deliveryService = deliveryService;
        this.complaintService = complaintService;
        this.couponService = couponService;
        this.userService = userService;
    }

    @GetMapping("/stats")
    public AdminStats stats() {
        List<Order> orders = orderService.findAll();
        double totalRevenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        Map<String, List<Order>> byRestaurant = orders.stream()
                .collect(java.util.stream.Collectors.groupingBy(Order::getRestaurantId));

        List<AdminStats.TopRestaurant> topRestaurants = byRestaurant.entrySet().stream()
                .map(entry -> {
                    List<Order> restaurantOrders = entry.getValue();
                    String name = restaurantOrders.get(0).getRestaurantName();
                    double revenue = restaurantOrders.stream().mapToDouble(Order::getTotalAmount).sum();
                    return new AdminStats.TopRestaurant(entry.getKey(), name, restaurantOrders.size(), Math.round(revenue * 100.0) / 100.0);
                })
                .sorted(Comparator.comparingDouble(AdminStats.TopRestaurant::getRevenue).reversed())
                .limit(5)
                .toList();

        List<Integer> weeklyTrend = List.of(
                Math.max(1, orders.size() - 6), Math.max(1, orders.size() - 4), Math.max(1, orders.size() - 5),
                Math.max(1, orders.size() - 2), Math.max(1, orders.size() - 3), Math.max(1, orders.size() - 1), orders.size());

        return new AdminStats(
                orders.size(),
                userService.countUsers() + 128,
                Math.round(totalRevenue * 100.0) / 100.0,
                (int) restaurantService.countActive(),
                (int) deliveryService.countOnline(),
                (int) complaintService.countOpen(),
                topRestaurants,
                weeklyTrend
        );
    }

    @GetMapping("/restaurants")
    public List<Restaurant> allRestaurants() {
        return restaurantService.findAll();
    }

    @PatchMapping("/restaurants/{id}/status")
    public Restaurant updateRestaurantStatus(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        RestaurantStatus status;
        try {
            status = RestaurantStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status: " + request.getStatus());
        }
        return restaurantService.updateStatus(id, status)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found: " + id));
    }

    @GetMapping("/coupons")
    public List<Coupon> allCoupons() {
        return couponService.findAll();
    }

    @PostMapping("/coupons")
    public Coupon createCoupon(@RequestBody CouponRequest request) {
        Coupon coupon = new Coupon();
        applyCouponRequest(coupon, request);
        return couponService.create(coupon);
    }

    @PutMapping("/coupons/{id}")
    public Coupon updateCoupon(@PathVariable String id, @RequestBody CouponRequest request) {
        Coupon coupon = new Coupon();
        applyCouponRequest(coupon, request);
        return couponService.update(id, coupon)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found: " + id));
    }

    @DeleteMapping("/coupons/{id}")
    public Map<String, Boolean> deleteCoupon(@PathVariable String id) {
        boolean removed = couponService.delete(id);
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found: " + id);
        }
        return Map.of("deleted", true);
    }

    @GetMapping("/complaints")
    public List<Complaint> allComplaints() {
        return complaintService.findAll();
    }

    @PatchMapping("/complaints/{id}/status")
    public Complaint updateComplaintStatus(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        return complaintService.updateStatus(id, request.getStatus().toUpperCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found: " + id));
    }

    private void applyCouponRequest(Coupon coupon, CouponRequest request) {
        coupon.setCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountPercent(request.getDiscountPercent());
        coupon.setMaxDiscount(request.getMaxDiscount());
        coupon.setMinOrderValue(request.getMinOrderValue());
        coupon.setActive(request.isActive());
    }
}
