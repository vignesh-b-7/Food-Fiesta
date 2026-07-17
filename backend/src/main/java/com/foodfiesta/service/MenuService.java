package com.foodfiesta.service;

import com.foodfiesta.model.MenuItem;
import com.foodfiesta.model.MenuSection;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final Map<String, MenuItem> items = new ConcurrentHashMap<>();
    private final AtomicInteger sequence = new AtomicInteger(1000);

    public void save(MenuItem item) {
        items.put(item.getId(), item);
    }

    public List<MenuItem> findByRestaurant(String restaurantId) {
        return items.values().stream()
                .filter(i -> i.getRestaurantId().equals(restaurantId))
                .sorted((a, b) -> a.getName().compareTo(b.getName()))
                .toList();
    }

    public Map<MenuSection, List<MenuItem>> findByRestaurantGrouped(String restaurantId) {
        Map<MenuSection, List<MenuItem>> grouped = new EnumMap<>(MenuSection.class);
        for (MenuSection section : MenuSection.values()) {
            grouped.put(section, new ArrayList<>());
        }
        findByRestaurant(restaurantId).forEach(item -> grouped.get(item.getSection()).add(item));
        return grouped;
    }

    public Optional<MenuItem> findById(String id) {
        return Optional.ofNullable(items.get(id));
    }

    public MenuItem addItem(String restaurantId, MenuItem item) {
        item.setId("item-" + sequence.incrementAndGet());
        item.setRestaurantId(restaurantId);
        items.put(item.getId(), item);
        return item;
    }

    public Optional<MenuItem> updateItem(String id, MenuItem updated) {
        MenuItem existing = items.get(id);
        if (existing == null) {
            return Optional.empty();
        }
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setSection(updated.getSection());
        existing.setPrice(updated.getPrice());
        existing.setImageUrl(updated.getImageUrl());
        existing.setVeg(updated.isVeg());
        existing.setInStock(updated.isInStock());
        existing.setBestseller(updated.isBestseller());
        return Optional.of(existing);
    }

    public Optional<MenuItem> toggleStock(String id) {
        MenuItem existing = items.get(id);
        if (existing == null) {
            return Optional.empty();
        }
        existing.setInStock(!existing.isInStock());
        return Optional.of(existing);
    }

    public boolean deleteItem(String id) {
        return items.remove(id) != null;
    }

    public Map<String, MenuItem> all() {
        return items;
    }
}
