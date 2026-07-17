package com.foodfiesta.service;

import com.foodfiesta.model.Complaint;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ComplaintService {

    private final Map<String, Complaint> complaints = new ConcurrentHashMap<>();
    private final AtomicInteger sequence = new AtomicInteger(300);

    public void save(Complaint complaint) {
        complaints.put(complaint.getId(), complaint);
    }

    public List<Complaint> findAll() {
        return complaints.values().stream()
                .sorted(Comparator.comparing(Complaint::getCreatedAt).reversed())
                .toList();
    }

    public Complaint create(Complaint complaint) {
        complaint.setId("ticket-" + sequence.incrementAndGet());
        complaint.setCreatedAt(Instant.now());
        if (complaint.getStatus() == null) {
            complaint.setStatus("OPEN");
        }
        complaints.put(complaint.getId(), complaint);
        return complaint;
    }

    public Optional<Complaint> updateStatus(String id, String status) {
        Complaint complaint = complaints.get(id);
        if (complaint == null) {
            return Optional.empty();
        }
        complaint.setStatus(status);
        return Optional.of(complaint);
    }

    public long countOpen() {
        return complaints.values().stream().filter(c -> "OPEN".equalsIgnoreCase(c.getStatus())).count();
    }
}
