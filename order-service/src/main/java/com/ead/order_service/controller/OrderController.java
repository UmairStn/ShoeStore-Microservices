package com.ead.order_service.controller;

import com.ead.order_service.dto.OrderRequest;
import com.ead.order_service.model.Order;
import com.ead.order_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
// Allows requests from your React Frontend (usually running on port 3000)
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. Place Order
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        Order savedOrder = orderService.placeOrder(orderRequest);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    // 2. Get Order History for a User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}