import React from 'react';

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  depositor,
  value,
  handleApproveDepositor,
  handleApproveArbiter,
  handleDispense,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Depositor </div>
          <div> {depositor} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} ETH </div>
        </li>
        <div className="button" id={address} onClick={handleApproveDepositor}>
          Approve Depositor
        </div>
        <div className="button" id={`arbiter-${address}`} onClick={handleApproveArbiter}>
          Approve Arbiter
        </div>
        <div className="button" id={`dispense-${address}`} onClick={handleDispense}>
          Dispense
        </div>
      </ul>
    </div>
  );
}
