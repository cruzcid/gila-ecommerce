package com.gila.ecommerce.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    List<Product> findByCategory(String category);

    @Query("""
            SELECT p FROM Product p
            WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<Product> search(@Param("query") String query);
}
