import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

export default async function deploy(signer, arbiter, beneficiary, depositor, value) {
  const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);

  // Deploy the contract with the provided constructor arguments
  const escrow = await factory.deploy(arbiter, beneficiary);

  // Wait for the contract to be mined and obtain the deployed contract instance
  await escrow.deployed();

  // Create approve function to transfer Ether to the beneficiary
  const approveDepositor = async () => {
    // Check if the depositor has approved the transaction
    const isDepositorApproved = await escrow.approvedByDepositor();

    if (isDepositorApproved) {
      // Transfer Ether to the arbiter's address
      await signer.sendTransaction({
        to: arbiter,
        value: value,
      });
    }
  };

  const approveArbiter = async () => {
    // Check if both the arbiter and depositor have approved the transaction
    const isDepositorApproved = await escrow.approvedByDepositor();
    const isArbiterApproved = await escrow.approvedByArbiter();

    if (isDepositorApproved && isArbiterApproved) {
      // Transfer Ether to the beneficiary's address
      await signer.sendTransaction({
        to: beneficiary,
        value: value,
      });
    }
  };

  // Create dispense function to transfer Ether to the beneficiary
  const dispense = async () => {
    // Check if the arbiter has approved the transaction
    const isArbiterApproved = await escrow.approvedByArbiter();

    if (isArbiterApproved) {
      // Transfer Ether to the beneficiary's address
      await signer.sendTransaction({
        to: beneficiary,
        value: value,
      });
    }
  };

  // Add event listeners for approval and dispense
  escrow.on('ApprovedByDepositor', approveDepositor);
  escrow.on('ApprovedByArbiter', approveArbiter);
  escrow.on('ApprovedByArbiter', dispense);

  return escrow;
}
