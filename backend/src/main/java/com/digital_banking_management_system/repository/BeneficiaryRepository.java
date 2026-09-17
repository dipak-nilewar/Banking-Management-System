 package com.digital_banking_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.digital_banking_management_system.entity.Beneficiary;
import com.digital_banking_management_system.entity.Customer;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

   List<Beneficiary> findByCustomer(Customer customer);
}