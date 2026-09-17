 package com.digital_banking_management_system.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.digital_banking_management_system.entity.Customer;
import com.digital_banking_management_system.entity.KycStatus;
import com.digital_banking_management_system.entity.User;
import com.digital_banking_management_system.exception.CustomerNotFoundException;
import com.digital_banking_management_system.exception.DuplicateAccountException;
import com.digital_banking_management_system.repository.CustomerRepository;
import com.digital_banking_management_system.repository.UserRepository;


@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
     public CustomerService(
        CustomerRepository customerRepository,
        UserRepository userRepository,
        AuditLogService auditLogService) {

    this.customerRepository = customerRepository;
    this.userRepository = userRepository;
    this.auditLogService = auditLogService;
}

    public Customer createCustomer(
            Long userId,
            String phone,
            String address) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomerNotFoundException("User not found"));
validateUserOwnership(user);

        if (customerRepository.findByUser(user).isPresent()) {
            throw new DuplicateAccountException(
                    "Customer profile already exists");
        }

        Customer customer = Customer.builder()
                .user(user)
                .phone(phone)
                .address(address)
                .kycStatus(KycStatus.PENDING)
                .build();

        return customerRepository.save(customer);
    }
    
    public Customer updateCustomer(
        Long customerId,
        String phone,
        String address) {

    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() ->
                    new CustomerNotFoundException("Customer not found"));
                    validateCustomerOwnership(customer);

    customer.setPhone(phone);
    customer.setAddress(address);

    return customerRepository.save(customer);
}

public Customer getCustomer(Long customerId) {

    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() ->
                    new CustomerNotFoundException("Customer not found"));

    validateCustomerOwnership(customer);

    return customer;
}

private void validateCustomerOwnership(Customer customer) {

    String loggedInEmail = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    if (!customer.getUser().getEmail()
            .equalsIgnoreCase(loggedInEmail)) {

        throw new CustomerNotFoundException("Customer not found");
    }
}
 

private void validateUserOwnership(User user) {

    String loggedInEmail = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    if (!user.getEmail().equalsIgnoreCase(loggedInEmail)) {
        throw new CustomerNotFoundException("User not found");
    }
    
}

  public Customer updateKycStatus(
        Long customerId,
        KycStatus status) {

    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() ->
                    new CustomerNotFoundException("Customer not found"));

    KycStatus oldStatus = customer.getKycStatus();

    customer.setKycStatus(status);

    Customer savedCustomer = customerRepository.save(customer);

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    auditLogService.log(
            "KYC_STATUS_CHANGED",
            email,
            "SUCCESS",
            "Customer ID: " + customerId
                    + ", KYC status changed from "
                    + oldStatus
                    + " to "
                    + status
    );

    return savedCustomer;
}
public Customer getMyCustomer() {

    String loggedInEmail = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository
            .findByEmail(loggedInEmail)
            .orElseThrow(() ->
                    new CustomerNotFoundException("User not found"));

    return customerRepository
            .findByUser(user)
            .orElseThrow(() ->
                    new CustomerNotFoundException(
                            "Customer profile not found"));
}

public List<Customer> getAllCustomers() {
    return customerRepository.findAll();
}

}