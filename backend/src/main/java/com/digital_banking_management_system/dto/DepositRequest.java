 package com.digital_banking_management_system.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class DepositRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(
        value = "1.0",
        message = "Deposit amount must be greater than 0"
    )
    private Double amount;

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}