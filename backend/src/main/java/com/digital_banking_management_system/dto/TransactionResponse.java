 package com.digital_banking_management_system.dto;

import java.time.LocalDateTime;

import com.digital_banking_management_system.entity.TransactionStatus;
import com.digital_banking_management_system.entity.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private String referenceNumber;
    private TransactionType type;
    private Double amount;
    private TransactionStatus status;
    private LocalDateTime transactionDate;
}