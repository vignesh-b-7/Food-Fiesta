package com.foodfiesta.service;

import com.foodfiesta.model.DeliveryPartner;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DeliveryService {

    private final Map<String, DeliveryPartner> partners = new ConcurrentHashMap<>();

    public void save(DeliveryPartner partner) {
        partners.put(partner.getId(), partner);
    }

    public List<DeliveryPartner> findAll() {
        return partners.values().stream().sorted((a, b) -> a.getName().compareTo(b.getName())).toList();
    }

    public Optional<DeliveryPartner> findById(String id) {
        return Optional.ofNullable(partners.get(id));
    }

    public Optional<DeliveryPartner> setOnline(String id, boolean online) {
        DeliveryPartner partner = partners.get(id);
        if (partner == null) {
            return Optional.empty();
        }
        partner.setOnline(online);
        return Optional.of(partner);
    }

    public Optional<DeliveryPartner> assignOrder(String id, String orderId) {
        DeliveryPartner partner = partners.get(id);
        if (partner == null) {
            return Optional.empty();
        }
        partner.setActiveOrderId(orderId);
        return Optional.of(partner);
    }

    public Optional<DeliveryPartner> completeDelivery(String id, double tip, double incentive, double basePay) {
        DeliveryPartner partner = partners.get(id);
        if (partner == null) {
            return Optional.empty();
        }
        partner.setActiveOrderId(null);
        partner.setCompletedDeliveries(partner.getCompletedDeliveries() + 1);
        partner.setBaseEarnings(partner.getBaseEarnings() + basePay);
        partner.setIncentiveEarnings(partner.getIncentiveEarnings() + incentive);
        partner.setTipEarnings(partner.getTipEarnings() + tip);
        return Optional.of(partner);
    }

    public long countOnline() {
        return partners.values().stream().filter(DeliveryPartner::isOnline).count();
    }
}
