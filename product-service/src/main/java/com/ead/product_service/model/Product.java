package com.ead.product_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    private Long id;

    private String name;
    private String description;
    private double price;
    private Integer inventoryCount;
    private Boolean isAvailable;
    private String image;
}
