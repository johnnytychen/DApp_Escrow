// Escrow.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;
    uint256 public value;
    bool public approvedByBeneficiary;
    bool public approvedByDepositor;
    bool public approvedByArbiter;

    event ApprovedByBeneficiary();
    event ApprovedByDepositor();
    event ApprovedByArbiter();

    constructor(address _arbiter, address _beneficiary) {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }

    function approve() external onlyDepositor {
        approvedByDepositor = true;
        emit ApprovedByDepositor();
    }

    function approveByArbiter() external onlyArbiter {
        approvedByArbiter = true;
        emit ApprovedByArbiter();
    }

    function dispense() external onlyArbiter {
        require(approvedByDepositor && approvedByArbiter, "Escrow: Not approved by all parties");
        approvedByBeneficiary = true;
        emit ApprovedByBeneficiary();
    }

    modifier onlyDepositor() {
        require(msg.sender == depositor, "Escrow: Only depositor can call this function");
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Escrow: Only arbiter can call this function");
        _;
    }
}
