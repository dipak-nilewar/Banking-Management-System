 package com.digital_banking_management_system.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.digital_banking_management_system.entity.AuditLog;
import com.digital_banking_management_system.repository.AuditLogRepository;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(
            String action,
            String email,
            String status,
            String details) {

        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .email(email)
                .timestamp(LocalDateTime.now())
                .status(status)
                .details(details)
                .build();

        auditLogRepository.save(auditLog);
    }
}