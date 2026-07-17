package com.foodfiesta.controller;

import com.foodfiesta.dto.RestaurantSummary;
import com.foodfiesta.model.MenuItem;
import com.foodfiesta.model.MenuSection;
import com.foodfiesta.model.Restaurant;
import com.foodfiesta.model.RestaurantStatus;
import com.foodfiesta.model.Review;
import com.foodfiesta.service.MenuService;
import com.foodfiesta.service.RestaurantService;
import com.foodfiesta.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final ReviewService reviewService;

    public RestaurantController(RestaurantService restaurantService, MenuService menuService, ReviewService reviewService) {
        this.restaurantService = restaurantService;
        this.menuService = menuService;
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<RestaurantSummary> listActive() {
        return restaurantService.findAll().stream()
                .filter(r -> r.getStatus() == RestaurantStatus.ACTIVE)
                .map(r -> new RestaurantSummary(r, menuService.findByRestaurant(r.getId()).size()))
                .toList();
    }

    @GetMapping("/{id}")
    public RestaurantSummary getById(@PathVariable String id) {
        Restaurant restaurant = restaurantService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found: " + id));
        return new RestaurantSummary(restaurant, menuService.findByRestaurant(id).size());
    }

    @GetMapping("/{id}/menu")
    public Map<MenuSection, List<MenuItem>> getMenu(@PathVariable String id) {
        restaurantService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found: " + id));
        return menuService.findByRestaurantGrouped(id);
    }

    @GetMapping("/{id}/reviews")
    public List<Review> getReviews(@PathVariable String id) {
        return reviewService.findByRestaurant(id);
    }

    @PostMapping("/{id}/reviews")
    public Review addReview(@PathVariable String id, @RequestBody Review review) {
        restaurantService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found: " + id));
        review.setRestaurantId(id);
        return reviewService.create(review);
    }
}
