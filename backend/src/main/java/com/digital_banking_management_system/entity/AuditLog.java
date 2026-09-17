    package com.digital_banking_management_system.entity;

    import java.time.LocalDateTime;

    import jakarta.persistence.*;
    import lombok.*;

    @Entity
    @Table(name = "audit_logs")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class AuditLog {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String action;

        @Column(nullable = false)
        private String email;

        @Column(nullable = false)
        private LocalDateTime timestamp;

        @Column(nullable = false)
        private String status;

        private String details;
    }