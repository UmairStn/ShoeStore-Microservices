package com.ead.order_service.controller;

import com.ead.order_service.dto.OrderRequest;
import com.ead.order_service.model.Order;
import com.ead.order_service.model.OrderStatus;
import com.ead.order_service.repository.OrderRepository;
import com.ead.order_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    // 1. Get all orders (for admin)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    // 2. Place Order
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        Order savedOrder = orderService.placeOrder(orderRequest);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    // 3. Get Order History for a User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // 4. Update Order Status (for admin)
    @PatchMapping("/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOpt.get();

        if (updates.containsKey("status")) {
            String statusString = (String) updates.get("status");
            try {
                OrderStatus newStatus = OrderStatus.valueOf(statusString.toUpperCase());
                order.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        Order updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }

    // 5. Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. Delete order (for admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}