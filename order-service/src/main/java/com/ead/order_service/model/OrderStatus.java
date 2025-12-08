package com.ead.order_service.model;

public enum OrderStatus {
    PLACED,      // Use this as the default for "Buy -> Done"
    SHIPPED,
    CANCELED
}