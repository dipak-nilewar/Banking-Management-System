 package com.digital_banking_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.digital_banking_management_system.dto.BeneficiaryRequest;
import com.digital_banking_management_system.entity.Beneficiary;
import com.digital_banking_management_system.service.BeneficiaryService;
import com.digital_banking_management_system.service.AccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;
    private final AccountService accountService;

    public BeneficiaryController(BeneficiaryService beneficiaryService, AccountService accountService) {
        this.beneficiaryService = beneficiaryService;
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<Beneficiary> addBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request) {

        Beneficiary beneficiary =
                beneficiaryService.addBeneficiary(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(beneficiary);
    }

    @GetMapping
public ResponseEntity<List<Beneficiary>> getMyBeneficiaries() {

    return ResponseEntity.ok(
            beneficiaryService.getMyBeneficiaries()
    );
}

@DeleteMapping("/{beneficiaryId}")
public ResponseEntity<String> deleteBeneficiary(
        @PathVariable Long beneficiaryId) {

    beneficiaryService.deleteBeneficiary(beneficiaryId);

    return ResponseEntity.ok("Beneficiary deleted successfully");
}

@PostMapping("/{beneficiaryId}/transfer")
public ResponseEntity<String> transferToBeneficiary(
        @PathVariable Long beneficiaryId,
        @RequestParam Long senderAccountId,
        @RequestParam Double amount) {

    String receiverAccountNumber =
            beneficiaryService.getBeneficiaryAccountNumber(beneficiaryId);

    accountService.transfer(
            senderAccountId,
            receiverAccountNumber,
            amount
    );

    return ResponseEntity.ok("Transfer to beneficiary successful");
}

}