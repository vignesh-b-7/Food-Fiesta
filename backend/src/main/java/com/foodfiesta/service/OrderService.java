package com.foodfiesta.service;

import com.foodfiesta.model.Order;
import com.foodfiesta.model.OrderStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderService {

    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final AtomicInteger sequence = new AtomicInteger(5000);

    public Order create(Order order) {
        order.setId("FF-" + sequence.incrementAndGet());
        order.setCreatedAt(Instant.now());
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PLACED);
        }
        orders.put(order.getId(), order);
        return order;
    }

    public List<Order> findAll() {
        return orders.values().stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .toList();
    }

    public Optional<Order> findById(String id) {
        return Optional.ofNullable(orders.get(id));
    }

    public List<Order> findByUser(String userId) {
        return findAll().stream().filter(o -> userId.equals(o.getUserId())).toList();
    }

    public List<Order> findByRestaurant(String restaurantId) {
        return findAll().stream().filter(o -> restaurantId.equals(o.getRestaurantId())).toList();
    }

    public List<Order> findByDeliveryPartner(String deliveryPartnerId) {
        return findAll().stream().filter(o -> deliveryPartnerId.equals(o.getDeliveryPartnerId())).toList();
    }

    public List<Order> findUnassignedReadyOrders() {
        return findAll().stream()
                .filter(o -> o.getStatus() == OrderStatus.READY_FOR_PICKUP && o.getDeliveryPartnerId() == null)
                .toList();
    }

    public Optional<Order> updateStatus(String id, OrderStatus status, String deliveryPartnerId, String deliveryPartnerName) {
        Order order = orders.get(id);
        if (order == null) {
            return Optional.empty();
        }
        order.setStatus(status);
        if (deliveryPartnerId != null) {
            order.setDeliveryPartnerId(deliveryPartnerId);
            order.setDeliveryPartnerName(deliveryPartnerName);
        }
        return Optional.of(order);
    }

    public Map<String, Order> all() {
        return orders;
    }
}
