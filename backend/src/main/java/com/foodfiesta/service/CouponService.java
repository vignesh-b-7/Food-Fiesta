package com.foodfiesta.service;

import com.foodfiesta.model.Coupon;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class CouponService {

    private final Map<String, Coupon> coupons = new ConcurrentHashMap<>();
    private final AtomicInteger sequence = new AtomicInteger(100);

    public void save(Coupon coupon) {
        coupons.put(coupon.getId(), coupon);
    }

    public List<Coupon> findAll() {
        return coupons.values().stream().sorted((a, b) -> a.getCode().compareTo(b.getCode())).toList();
    }

    public List<Coupon> findActive() {
        return findAll().stream().filter(Coupon::isActive).toList();
    }

    public Optional<Coupon> findByCode(String code) {
        return coupons.values().stream().filter(c -> c.getCode().equalsIgnoreCase(code)).findFirst();
    }

    public Coupon create(Coupon coupon) {
        coupon.setId("coupon-" + sequence.incrementAndGet());
        coupons.put(coupon.getId(), coupon);
        return coupon;
    }

    public Optional<Coupon> update(String id, Coupon updated) {
        Coupon existing = coupons.get(id);
        if (existing == null) {
            return Optional.empty();
        }
        existing.setCode(updated.getCode());
        existing.setDescription(updated.getDescription());
        existing.setDiscountPercent(updated.getDiscountPercent());
        existing.setMaxDiscount(updated.getMaxDiscount());
        existing.setMinOrderValue(updated.getMinOrderValue());
        existing.setActive(updated.isActive());
        return Optional.of(existing);
    }

    public boolean delete(String id) {
        return coupons.remove(id) != null;
    }
}
