package com.foodfiesta.controller;

import com.foodfiesta.model.Coupon;
import com.foodfiesta.service.CouponService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping("/active")
    public List<Coupon> activeCoupons() {
        return couponService.findActive();
    }
}
