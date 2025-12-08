package com.ead.order_service.repository;

import com.ead.order_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom method to find orders by user ID
    List<Order> findByUserId(Long userId);
}