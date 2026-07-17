package com.foodfiesta.controller;

import com.foodfiesta.dto.StatusUpdateRequest;
import com.foodfiesta.model.DeliveryPartner;
import com.foodfiesta.model.Order;
import com.foodfiesta.service.DeliveryService;
import com.foodfiesta.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final OrderService orderService;

    public DeliveryController(DeliveryService deliveryService, OrderService orderService) {
        this.deliveryService = deliveryService;
        this.orderService = orderService;
    }

    @GetMapping("/partners")
    public List<DeliveryPartner> listPartners() {
        return deliveryService.findAll();
    }

    @GetMapping("/partners/{id}")
    public DeliveryPartner getPartner(@PathVariable String id) {
        return deliveryService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery partner not found: " + id));
    }

    @PatchMapping("/partners/{id}/online")
    public DeliveryPartner setOnline(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        boolean online = "true".equalsIgnoreCase(request.getStatus()) || "online".equalsIgnoreCase(request.getStatus());
        return deliveryService.setOnline(id, online)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery partner not found: " + id));
    }

    @GetMapping("/available-orders")
    public List<Order> availableOrders() {
        return orderService.findUnassignedReadyOrders();
    }

    @PostMapping("/partners/{id}/accept/{orderId}")
    public Order acceptOrder(@PathVariable String id, @PathVariable String orderId) {
        DeliveryPartner partner = deliveryService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery partner not found: " + id));
        Order order = orderService.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderId));
        if (order.getDeliveryPartnerId() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Order already accepted by another partner");
        }
        deliveryService.assignOrder(id, orderId);
        return orderService.updateStatus(orderId, order.getStatus(), id, partner.getName()).orElseThrow();
    }
}
