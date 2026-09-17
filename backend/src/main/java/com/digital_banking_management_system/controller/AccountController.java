package com.digital_banking_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.digital_banking_management_system.dto.AccountRequest;
import com.digital_banking_management_system.dto.DepositRequest;
import com.digital_banking_management_system.dto.TransactionResponse;
import com.digital_banking_management_system.dto.TransferRequest;
import com.digital_banking_management_system.dto.WithdrawRequest;
import com.digital_banking_management_system.entity.Account;
import com.digital_banking_management_system.entity.AccountStatus;
import com.digital_banking_management_system.service.AccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/{customerId}")
    public ResponseEntity<Account> createAccount(
            @PathVariable Long customerId,
            @Valid @RequestBody AccountRequest request) {

        Account account = accountService.createAccount(
                customerId,
                request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(account);
    }

    @GetMapping("/my-accounts")
public ResponseEntity<List<Account>> getMyAccounts() {

    List<Account> accounts = accountService.getMyAccounts();

    return ResponseEntity.ok(accounts);
}

    @GetMapping("/{accountId}")
    public ResponseEntity<Account> getAccount(
            @PathVariable Long accountId) {

        Account account = accountService.getAccount(accountId);

        return ResponseEntity.ok(account);
    }

    @PostMapping("/{accountId}/deposit")
    public ResponseEntity<Account> deposit(
            @PathVariable Long accountId,
            @Valid @RequestBody DepositRequest request) {

        Account account = accountService.deposit(
                accountId,
                request.getAmount());

        return ResponseEntity.ok(account);
    }

    @PostMapping("/{accountId}/withdraw")
    public ResponseEntity<Account> withdraw(
            @PathVariable Long accountId,
            @Valid @RequestBody WithdrawRequest request) {

        Account account = accountService.withdraw(
                accountId,
                request.getAmount());

        return ResponseEntity.ok(account);
    }

    @GetMapping("/{accountId}/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            @PathVariable Long accountId) {

        List<TransactionResponse> transactions = accountService.getTransactionHistory(accountId);

        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/{senderAccountId}/transfer")
    public ResponseEntity<String> transfer(
            @PathVariable Long senderAccountId,
            @Valid @RequestBody TransferRequest request) {

        accountService.transfer(
                senderAccountId,
                request.getReceiverAccountNumber(),
                request.getAmount());

        return ResponseEntity.ok("Transfer successful");
    }

@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/{accountId}/status")
public ResponseEntity<Account> updateAccountStatus(
        @PathVariable Long accountId,
        @RequestParam AccountStatus status) {

    return ResponseEntity.ok(
            accountService.updateAccountStatus(accountId, status)
    );
}
    
@PreAuthorize("hasRole('ADMIN')")
@GetMapping
public ResponseEntity<List<Account>> getAllAccounts() {

    return ResponseEntity.ok(
            accountService.getAllAccounts()
    );
}

@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/transactions")
public ResponseEntity<List<TransactionResponse>> getAllTransactions() {

    return ResponseEntity.ok(
            accountService.getAllTransactions()
    );
}
}