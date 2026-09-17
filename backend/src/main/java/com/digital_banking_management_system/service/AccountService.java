 package com.digital_banking_management_system.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.digital_banking_management_system.dto.AccountRequest;
import com.digital_banking_management_system.dto.TransactionResponse;
import com.digital_banking_management_system.entity.Account;
import com.digital_banking_management_system.entity.AccountStatus;
import com.digital_banking_management_system.entity.Customer;
import com.digital_banking_management_system.entity.Transaction;
import com.digital_banking_management_system.entity.TransactionStatus;
import com.digital_banking_management_system.entity.TransactionType;
import com.digital_banking_management_system.repository.AccountRepository;
import com.digital_banking_management_system.repository.CustomerRepository;
import com.digital_banking_management_system.repository.TransactionRepository;
import com.digital_banking_management_system.exception.AccountInactiveException;
import com.digital_banking_management_system.exception.AccountNotFoundException;
import com.digital_banking_management_system.exception.InsufficientBalanceException;
import com.digital_banking_management_system.exception.InvalidTransferException;
import com.digital_banking_management_system.exception.UserNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final AuditLogService auditLogService;

 public AccountService(
        AccountRepository accountRepository,
        CustomerRepository customerRepository,
        TransactionRepository transactionRepository,
        AuditLogService auditLogService) {

    this.accountRepository = accountRepository;
    this.customerRepository = customerRepository;
    this.transactionRepository = transactionRepository;
    this.auditLogService = auditLogService;
}
    public Account createAccount(
            Long customerId,
            AccountRequest request) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new UserNotFoundException("Customer not found"));
validateCustomerOwnership(customer);
        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(request.getAccountType())
                .balance(0.0)
                .status(AccountStatus.ACTIVE)
                .customer(customer)
                .build();

        return accountRepository.save(account);
    }

    private String generateAccountNumber() {

        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12);
    }
  public Account getAccount(Long accountId) {

    Account account = accountRepository.findById(accountId)
            .orElseThrow(() ->
                    new AccountNotFoundException("Account not found"));

    validateAccountOwnership(account);

    return account;
}

public List<Account> getMyAccounts() {

    String loggedInEmail = getLoggedInUserEmail();

    Customer customer = customerRepository
            .findByUserEmail(loggedInEmail)
            .orElseThrow(() ->
                    new UserNotFoundException("Customer not found"));

    return accountRepository.findByCustomer(customer);
}
 public Account deposit(
        Long accountId,
        Double amount) {

    Account account = accountRepository.findById(accountId)
            .orElseThrow(() ->
                    new AccountNotFoundException("Account not found"));

 
    validateAccountOwnership(account);

    if (account.getStatus() != AccountStatus.ACTIVE) {
        throw new AccountInactiveException("Account is not active");
    }

    account.setBalance(account.getBalance() + amount);

    Account savedAccount = accountRepository.save(account);

    Transaction transaction = Transaction.builder()
            .referenceNumber(UUID.randomUUID().toString())
            .type(TransactionType.DEPOSIT)
            .amount(amount)
            .status(TransactionStatus.SUCCESS)
            .transactionDate(java.time.LocalDateTime.now())
            .account(account)
            .build();

    transactionRepository.save(transaction);

String email = getLoggedInUserEmail();

auditLogService.log(
        "DEPOSIT",
        email,
        "SUCCESS",
        "Deposit of " + amount +
        " to account " + account.getAccountNumber()
);

    return savedAccount;
}
 public Account withdraw(
        Long accountId,
        Double amount) {

    Account account = accountRepository.findById(accountId)
            .orElseThrow(() ->
                    new AccountNotFoundException("Account not found"));
 validateAccountOwnership(account);

    if (account.getStatus() != AccountStatus.ACTIVE) {
        throw new AccountInactiveException("Account is not active");
    }

    if (account.getBalance() < amount) {
        throw new InsufficientBalanceException("Insufficient balance");
    }

    // 1. Deduct amount from account
    account.setBalance(account.getBalance() - amount);

    // 2. Save updated balance
    Account savedAccount = accountRepository.save(account);

    // 3. Create withdrawal transaction
    Transaction transaction = Transaction.builder()
            .referenceNumber(UUID.randomUUID().toString())
            .type(TransactionType.WITHDRAW)
            .amount(amount)
            .status(TransactionStatus.SUCCESS)
            .transactionDate(java.time.LocalDateTime.now())
            .account(account)
            .build();

    // 4. Save transaction
    transactionRepository.save(transaction);

    String email = getLoggedInUserEmail();

auditLogService.log(
        "WITHDRAW",
        email,
        "SUCCESS",
        "Withdrawal of " + amount +
        " from account " + account.getAccountNumber()
);

    return savedAccount;
} public List<TransactionResponse> getTransactionHistory(Long accountId) {

    Account account = accountRepository.findById(accountId)
            .orElseThrow(() ->
                    new AccountNotFoundException("Account not found"));

                     validateAccountOwnership(account);
    List<Transaction> transactions =
            transactionRepository
                    .findByAccountOrderByTransactionDateDesc(account);

    return transactions.stream()
            .map(transaction -> new TransactionResponse(
                    transaction.getId(),
                    transaction.getReferenceNumber(),
                    transaction.getType(),
                    transaction.getAmount(),
                    transaction.getStatus(),
                    transaction.getTransactionDate()
            ))
            .toList();
}
 @Transactional
public void transfer(
        Long senderAccountId,
        String receiverAccountNumber,
        Double amount) {

    Account sender = accountRepository.findById(senderAccountId)
            .orElseThrow(() ->
                    new AccountNotFoundException("Sender account not found"));
 validateAccountOwnership(sender);
                    
    Account receiver = accountRepository
            .findByAccountNumber(receiverAccountNumber)
            .orElseThrow(() ->
                    new AccountNotFoundException("Receiver account not found"));
 if (sender.getId().equals(receiver.getId())) {
    throw new InvalidTransferException(
            "Sender and receiver accounts cannot be the same");
}

if (sender.getStatus() != AccountStatus.ACTIVE) {
    throw new AccountInactiveException("Sender account is not active");
}

if (receiver.getStatus() != AccountStatus.ACTIVE) {
    throw new AccountInactiveException("Receiver account is not active");
}

if (amount == null || amount <= 0) {
    throw new InvalidTransferException(
            "Transfer amount must be greater than 0");
}

if (sender.getBalance() < amount) {
    throw new InsufficientBalanceException("Insufficient balance");
}
    // Debit sender
    sender.setBalance(sender.getBalance() - amount);

    // Credit receiver
    receiver.setBalance(receiver.getBalance() + amount);

    accountRepository.save(sender);
    accountRepository.save(receiver);

    // Sender transaction
    Transaction senderTransaction = Transaction.builder()
            .referenceNumber(UUID.randomUUID().toString())
            .type(TransactionType.TRANSFER)
            .amount(amount)
            .status(TransactionStatus.SUCCESS)
            .transactionDate(java.time.LocalDateTime.now())
            .account(sender)
            .build();

    // Receiver transaction
    // Receiver transaction
Transaction receiverTransaction = Transaction.builder()
        .referenceNumber(UUID.randomUUID().toString())
        .type(TransactionType.TRANSFER)
        .amount(amount)
        .status(TransactionStatus.SUCCESS)
        .transactionDate(java.time.LocalDateTime.now())
        .account(receiver)
        .build();

transactionRepository.save(senderTransaction);
transactionRepository.save(receiverTransaction);

String email = getLoggedInUserEmail();

auditLogService.log(
        "TRANSFER",
        email,
        "SUCCESS",
        "Transfer of " + amount +
        " from account " + sender.getAccountNumber() +
        " to account " + receiver.getAccountNumber()
);
}
 

private void validateAccountOwnership(Account account) {

    String loggedInEmail = getLoggedInUserEmail();

    if (!account.getCustomer().getUser().getEmail()
            .equalsIgnoreCase(loggedInEmail)) {

        throw new AccountNotFoundException("Account not found");
    }
}

private String getLoggedInUserEmail() {

    return SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();
}

private void validateCustomerOwnership(Customer customer) {

    String loggedInEmail = getLoggedInUserEmail();

    if (!customer.getUser().getEmail()
            .equalsIgnoreCase(loggedInEmail)) {

        throw new UserNotFoundException("Customer not found");
    }
}

public List<Account> getAllAccounts() {
    return accountRepository.findAll();
}

public List<TransactionResponse> getAllTransactions() {

    List<Transaction> transactions =
            transactionRepository.findAll();

    return transactions.stream()
            .map(transaction -> new TransactionResponse(
                    transaction.getId(),
                    transaction.getReferenceNumber(),
                    transaction.getType(),
                    transaction.getAmount(),
                    transaction.getStatus(),
                    transaction.getTransactionDate()
            ))
            .toList();
}

public Account updateAccountStatus(
        Long accountId,
        AccountStatus status) {

    Account account = accountRepository.findById(accountId)
            .orElseThrow(() ->
                    new AccountNotFoundException("Account not found"));

    account.setStatus(status);

    return accountRepository.save(account);
}



}