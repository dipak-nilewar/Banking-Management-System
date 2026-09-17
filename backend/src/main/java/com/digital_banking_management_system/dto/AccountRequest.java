 package com.digital_banking_management_system.dto;

import com.digital_banking_management_system.entity.AccountType;

import jakarta.validation.constraints.NotNull;

public class AccountRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}