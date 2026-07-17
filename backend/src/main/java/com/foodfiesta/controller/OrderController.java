package com.foodfiesta.controller;

import com.foodfiesta.dto.OrderStatusUpdateRequest;
import com.foodfiesta.dto.PlaceOrderRequest;
import com.foodfiesta.model.Coupon;
import com.foodfiesta.model.DeliveryPartner;
import com.foodfiesta.model.MenuItem;
import com.foodfiesta.model.Order;
import com.foodfiesta.model.OrderItem;
import com.foodfiesta.model.OrderStatus;
import com.foodfiesta.model.PaymentMethod;
import com.foodfiesta.model.Restaurant;
import com.foodfiesta.service.CouponService;
import com.foodfiesta.service.DeliveryService;
import com.foodfiesta.service.MenuService;
import com.foodfiesta.service.OrderService;
import com.foodfiesta.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final double DELIVERY_FEE = 30;
    private static final double TAX_RATE = 0.05;

    private final OrderService orderService;
    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final CouponService couponService;
    private final DeliveryService deliveryService;

    public OrderController(OrderService orderService, RestaurantService restaurantService, MenuService menuService,
                            CouponService couponService, DeliveryService deliveryService) {
        this.orderService = orderService;
        this.restaurantService = restaurantService;
        this.menuService = menuService;
        this.couponService = couponService;
        this.deliveryService = deliveryService;
    }

    @PostMapping
    public Order placeOrder(@RequestBody PlaceOrderRequest request) {
        Restaurant restaurant = restaurantService.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found: " + request.getRestaurantId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must contain at least one item");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double itemsTotal = 0;
        for (PlaceOrderRequest.Item requested : request.getItems()) {
            MenuItem menuItem = menuService.findById(requested.getMenuItemId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found: " + requested.getMenuItemId()));
            int quantity = Math.max(1, requested.getQuantity());
            orderItems.add(new OrderItem(menuItem.getId(), menuItem.getName(), menuItem.getPrice(), quantity));
            itemsTotal += menuItem.getPrice() * quantity;
        }

        double discount = 0;
        String appliedCoupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponService.findByCode(request.getCouponCode()).orElse(null);
            if (coupon != null && coupon.isActive() && itemsTotal >= coupon.getMinOrderValue()) {
                discount = Math.min(itemsTotal * coupon.getDiscountPercent() / 100.0, coupon.getMaxDiscount());
                appliedCoupon = coupon.getCode();
            }
        }

        double taxes = round(itemsTotal * TAX_RATE);
        double totalAmount = round(itemsTotal + DELIVERY_FEE + taxes - discount);

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown payment method: " + request.getPaymentMethod());
        }

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setUserName(request.getUserName());
        order.setRestaurantId(restaurant.getId());
        order.setRestaurantName(restaurant.getName());
        order.setRestaurantImageUrl(restaurant.getImageUrl());
        order.setItems(orderItems);
        order.setItemsTotal(round(itemsTotal));
        order.setDeliveryFee(DELIVERY_FEE);
        order.setTaxes(taxes);
        order.setDiscount(round(discount));
        order.setCouponCode(appliedCoupon);
        order.setTotalAmount(totalAmount);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(paymentMethod);
        order.setTransactionId(generateTransactionId(paymentMethod));
        order.setStatus(OrderStatus.PLACED);
        order.setEstimatedDeliveryMinutes(restaurant.getDeliveryTimeMinutes());

        return orderService.create(order);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable String id) {
        return orderService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + id));
    }

    @GetMapping
    public List<Order> listOrders(@RequestParam(required = false) String userId,
                                   @RequestParam(required = false) String restaurantId,
                                   @RequestParam(required = false) String deliveryPartnerId) {
        if (userId != null) {
            return orderService.findByUser(userId);
        }
        if (restaurantId != null) {
            return orderService.findByRestaurant(restaurantId);
        }
        if (deliveryPartnerId != null) {
            return orderService.findByDeliveryPartner(deliveryPartnerId);
        }
        return orderService.findAll();
    }

    @PatchMapping("/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody OrderStatusUpdateRequest request) {
        OrderStatus status;
        try {
            status = OrderStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status: " + request.getStatus());
        }

        Order existing = orderService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + id));

        String deliveryPartnerId = request.getDeliveryPartnerId();
        String deliveryPartnerName = null;
        if (deliveryPartnerId != null) {
            DeliveryPartner partner = deliveryService.findById(deliveryPartnerId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery partner not found: " + deliveryPartnerId));
            deliveryPartnerName = partner.getName();
            deliveryService.assignOrder(deliveryPartnerId, id);
        }

        Order updated = orderService.updateStatus(id, status, deliveryPartnerId, deliveryPartnerName).orElseThrow();

        if (status == OrderStatus.DELIVERED && updated.getDeliveryPartnerId() != null) {
            double basePay = 35;
            double incentive = updated.getItemsTotal() > 400 ? 25 : 15;
            double tip = updated.getTotalAmount() > 600 ? 30 : updated.getTotalAmount() > 300 ? 15 : 5;
            deliveryService.completeDelivery(updated.getDeliveryPartnerId(), tip, incentive, basePay);
        }

        return updated;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String generateTransactionId(PaymentMethod method) {
        String prefix = switch (method) {
            case GOOGLE_PAY -> "GPAY";
            case PHONE_PE -> "PHPE";
            case PAYTM -> "PTM";
            case BHIM_UPI -> "UPI";
            case CARD -> "CARD";
            case NET_BANKING -> "NB";
            case COD -> "COD";
        };
        return prefix + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }
}
