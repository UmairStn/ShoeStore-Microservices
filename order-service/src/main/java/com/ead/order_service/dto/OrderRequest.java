package com.ead.order_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;

    // 1. Update the List type here
    private List<OrderItemDto> items;

    // 2. Rename the class here to 'OrderItemDto'
    @Data
    public static class OrderItemDto {
        private Long productId;
        private Integer quantity;
        private double price;
    }
}