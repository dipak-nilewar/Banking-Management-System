 package com.digital_banking_management_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital_banking_management_system.entity.Customer;
import com.digital_banking_management_system.entity.User;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

Optional<Customer> findByUserEmail(String email);

    Optional<Customer> findByUser(User user);
    
}