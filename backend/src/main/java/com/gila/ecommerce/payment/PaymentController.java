package com.gila.ecommerce.payment;

import com.gila.ecommerce.order.OrderResponse;
import com.gila.ecommerce.order.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<PaymentResponse> checkout(@Valid @RequestBody PaymentRequest request) {
        OrderResponse order = orderService.markAsPaid(request.getOrderId());

        PaymentResponse response = PaymentResponse.builder()
                .transactionId(UUID.randomUUID().toString())
                .orderId(order.getId())
                .amount(order.getTotalAmount())
                .status("APPROVED")
                .message("Payment processed successfully (simulated)")
                .processedAt(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentRequest {

        @NotNull(message = "Order ID is required")
        private Long orderId;

        @NotBlank(message = "Cardholder name is required")
        private String cardholderName;

        @NotBlank(message = "Card number is required")
        private String cardNumber;

        @NotBlank(message = "Expiry date is required")
        private String expiryDate;

        @NotBlank(message = "CVV is required")
        private String cvv;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
    }

    @Getter
    @Builder
    public static class PaymentResponse {
        private String transactionId;
        private Long orderId;
        private BigDecimal amount;
        private String status;
        private String message;
        private LocalDateTime processedAt;
    }
}
