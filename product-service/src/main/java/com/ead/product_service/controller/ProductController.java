package com.ead.product_service.controller;

import com.ead.product_service.model.Product;
import com.ead.product_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // 1. Get All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. Get Product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Add New Product (POST)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // 4. Update Product Inventory (PATCH) - For order inventory deduction
    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProductInventory(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();

        // Update inventory count if provided
        if (updates.containsKey("inventoryCount")) {
            Integer newInventory = (Integer) updates.get("inventoryCount");
            product.setInventoryCount(newInventory);

            // Auto-set availability based on inventory
            if (newInventory <= 0) {
                product.setIsAvailable(false);
            }
        }

        // Update availability if provided
        if (updates.containsKey("isAvailable")) {
            Boolean isAvailable = (Boolean) updates.get("isAvailable");
            product.setIsAvailable(isAvailable);
        }

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    // 5. Reduce Stock Endpoint
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setInventoryCount(productDetails.getInventoryCount());
        product.setIsAvailable(productDetails.getIsAvailable());
        product.setImage(productDetails.getImage());

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }
//    @PutMapping("/reduce/{id}")
//    public ResponseEntity<String> reduceStock(@PathVariable Long id, @RequestParam int quantity) {
//        return productRepository.findById(id)
//                .map(product -> {
//                    if (product.getInventoryCount() < quantity) {
//                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient stock.");
//                    }
//                    product.setInventoryCount(product.getInventoryCount() - quantity);
//
//                    // Auto-set availability to false if stock reaches 0
//                    if (product.getInventoryCount() == 0) {
//                        product.setIsAvailable(false);
//                    }
//
//                    productRepository.save(product);
//                    return ResponseEntity.ok("Stock updated.");
//                })
//                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found"));
//    }

    // 6. Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Product deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
    }
}