 package com.digital_banking_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital_banking_management_system.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}