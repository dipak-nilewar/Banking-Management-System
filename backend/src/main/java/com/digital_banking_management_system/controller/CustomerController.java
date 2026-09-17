 package com.digital_banking_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.digital_banking_management_system.dto.CustomerRequest;
import com.digital_banking_management_system.entity.Customer;
import com.digital_banking_management_system.entity.KycStatus;
import com.digital_banking_management_system.service.CustomerService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Customer> createCustomer(
            @PathVariable Long userId,
            @Valid @RequestBody CustomerRequest request) {

        Customer customer = customerService.createCustomer(
                userId,
                request.getPhone(),
                request.getAddress()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(customer);
    }

    @PutMapping("/{customerId}")
public ResponseEntity<Customer> updateCustomer(
        @PathVariable Long customerId,
        @Valid @RequestBody CustomerRequest request) {

    Customer customer = customerService.updateCustomer(
            customerId,
            request.getPhone(),
            request.getAddress()
    );

    return ResponseEntity.ok(customer);
}
@GetMapping("/me")
public ResponseEntity<Customer> getMyCustomer() {

    return ResponseEntity.ok(
            customerService.getMyCustomer()
    );
}
@GetMapping("/{customerId}")
public ResponseEntity<Customer> getCustomer(
        @PathVariable Long customerId) {

    Customer customer = customerService.getCustomer(customerId);

    return ResponseEntity.ok(customer);
}

@PreAuthorize("hasRole('ADMIN')")
@GetMapping
public ResponseEntity<List<Customer>> getAllCustomers() {

    return ResponseEntity.ok(
            customerService.getAllCustomers()
    );
}
 @PreAuthorize("hasRole('ADMIN')")
@PutMapping("/{customerId}/kyc")
public ResponseEntity<Customer> updateKycStatus(
        @PathVariable Long customerId,
        @RequestParam KycStatus status) {

    System.out.println("KYC METHOD CALLED");

    Customer customer = customerService.updateKycStatus(
            customerId,
            status
    );

    return ResponseEntity.ok(customer);
}



}