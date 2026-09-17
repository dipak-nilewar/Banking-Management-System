package com.digital_banking_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital_banking_management_system.entity.Transaction;
import com.digital_banking_management_system.entity.Account;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountOrderByTransactionDateDesc(
            Account account);
}