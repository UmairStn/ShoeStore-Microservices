package com.ead.order_service.service;

import com.ead.order_service.dto.OrderRequest;
import com.ead.order_service.model.Order;
import com.ead.order_service.model.OrderItem;
import com.ead.order_service.model.OrderStatus;
import com.ead.order_service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import this

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Transactional // Add this annotation
    public Order placeOrder(OrderRequest request) {
        Order order = new Order();

        // 1. Set Basic Fields
        order.setUserId(request.getUserId());
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setStatus(OrderStatus.PLACED);

        // 2. Map Items and Calculate Total
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemDto.getProductId());
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(itemDto.getPrice());
            item.setOrder(order); // Link the item back to the order

            orderItems.add(item);

            // Calculate subtotal for this item
            //BigDecimal lineTotal = itemDto.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            //totalAmount = totalAmount.add(lineTotal);
            // Assuming price and quantity are now double types
            double lineTotal = itemDto.getPrice() * itemDto.getQuantity();
            totalAmount += lineTotal;
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        // 3. Save to Database
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
