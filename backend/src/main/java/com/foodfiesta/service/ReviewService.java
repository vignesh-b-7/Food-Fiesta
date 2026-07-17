package com.foodfiesta.service;

import com.foodfiesta.model.Review;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ReviewService {

    private final Map<String, Review> reviews = new ConcurrentHashMap<>();
    private final AtomicInteger sequence = new AtomicInteger(700);

    public void save(Review review) {
        reviews.put(review.getId(), review);
    }

    public List<Review> findByRestaurant(String restaurantId) {
        return reviews.values().stream()
                .filter(r -> r.getRestaurantId().equals(restaurantId))
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .toList();
    }

    public Review create(Review review) {
        review.setId("review-" + sequence.incrementAndGet());
        review.setCreatedAt(Instant.now());
        reviews.put(review.getId(), review);
        return review;
    }
}
