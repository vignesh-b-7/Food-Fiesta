package com.foodfiesta.service;

import com.foodfiesta.model.Restaurant;
import com.foodfiesta.model.RestaurantStatus;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RestaurantService {

    private final Map<String, Restaurant> restaurants = new ConcurrentHashMap<>();

    public void save(Restaurant restaurant) {
        restaurants.put(restaurant.getId(), restaurant);
    }

    public List<Restaurant> findAll() {
        return restaurants.values().stream()
                .sorted((a, b) -> a.getName().compareTo(b.getName()))
                .toList();
    }

    public Collection<Restaurant> all() {
        return restaurants.values();
    }

    public Optional<Restaurant> findById(String id) {
        return Optional.ofNullable(restaurants.get(id));
    }

    public Optional<Restaurant> updateStatus(String id, RestaurantStatus status) {
        Restaurant restaurant = restaurants.get(id);
        if (restaurant == null) {
            return Optional.empty();
        }
        restaurant.setStatus(status);
        return Optional.of(restaurant);
    }

    public long countActive() {
        return restaurants.values().stream().filter(r -> r.getStatus() == RestaurantStatus.ACTIVE).count();
    }
}
