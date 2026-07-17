package com.foodfiesta.service;

import com.foodfiesta.model.Role;
import com.foodfiesta.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final Map<String, User> users = new ConcurrentHashMap<>();

    public void save(User user) {
        users.put(user.getId(), user);
    }

    public List<User> findAll() {
        return users.values().stream().sorted((a, b) -> a.getName().compareTo(b.getName())).toList();
    }

    public int countUsers() {
        return users.size();
    }

    public User loginOrCreate(String name, Role role) {
        String displayName = (name == null || name.isBlank()) ? defaultNameFor(role) : name.trim();
        String id = "user-" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(id, displayName, displayName.toLowerCase().replace(" ", ".") + "@foodfiesta.demo",
                role, "221B Baker Street, Koramangala, Bengaluru");
        users.put(id, user);
        return user;
    }

    private String defaultNameFor(Role role) {
        return switch (role) {
            case USER -> "Guest Diner";
            case RESTAURANT -> "Restaurant Partner";
            case DELIVERY -> "Delivery Partner";
            case ADMIN -> "Admin";
        };
    }
}
