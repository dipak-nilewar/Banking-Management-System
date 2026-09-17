 package com.digital_banking_management_system.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.digital_banking_management_system.dto.BeneficiaryRequest;
import com.digital_banking_management_system.entity.Beneficiary;
import com.digital_banking_management_system.entity.Customer;
import com.digital_banking_management_system.entity.User;
import com.digital_banking_management_system.repository.BeneficiaryRepository;
import com.digital_banking_management_system.repository.CustomerRepository;
import com.digital_banking_management_system.repository.UserRepository;
import com.digital_banking_management_system.exception.UserNotFoundException;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public BeneficiaryService(
            BeneficiaryRepository beneficiaryRepository,
            CustomerRepository customerRepository,
            UserRepository userRepository) {

        this.beneficiaryRepository = beneficiaryRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public Beneficiary addBeneficiary(BeneficiaryRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Customer customer = customerRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new UserNotFoundException("Customer not found"));

        Beneficiary beneficiary = Beneficiary.builder()
                .beneficiaryName(request.getBeneficiaryName())
                .accountNumber(request.getAccountNumber())
                .customer(customer)
                .build();

        return beneficiaryRepository.save(beneficiary);
    }

    public List<Beneficiary> getMyBeneficiaries() {

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new UserNotFoundException("User not found"));

    Customer customer = customerRepository
            .findByUser(user)
            .orElseThrow(() ->
                    new UserNotFoundException("Customer not found"));

    return beneficiaryRepository.findByCustomer(customer);
}
public void deleteBeneficiary(Long beneficiaryId) {

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new UserNotFoundException("User not found"));

    Customer customer = customerRepository
            .findByUser(user)
            .orElseThrow(() ->
                    new UserNotFoundException("Customer not found"));

    Beneficiary beneficiary = beneficiaryRepository
            .findById(beneficiaryId)
            .orElseThrow(() ->
                    new UserNotFoundException("Beneficiary not found"));

    if (!beneficiary.getCustomer().getId().equals(customer.getId())) {
        throw new UserNotFoundException("Beneficiary not found");
    }

    beneficiaryRepository.delete(beneficiary);
}

public String getBeneficiaryAccountNumber(Long beneficiaryId) {

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new UserNotFoundException("User not found"));

    Customer customer = customerRepository
            .findByUser(user)
            .orElseThrow(() ->
                    new UserNotFoundException("Customer not found"));

    Beneficiary beneficiary = beneficiaryRepository
            .findById(beneficiaryId)
            .orElseThrow(() ->
                    new UserNotFoundException("Beneficiary not found"));

    if (!beneficiary.getCustomer().getId().equals(customer.getId())) {
        throw new UserNotFoundException("Beneficiary not found");
    }

    return beneficiary.getAccountNumber();
}

}