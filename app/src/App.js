import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Escrow from './Escrow';
import deploy from './deploy';

const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/64iS71669j2MWMwQmJsFeTk6PBaYyKIf');

export async function approveDepositor(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function approveArbiter(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approveByArbiter();
  await approveTxn.wait();
}

export async function dispense(escrowContract, signer) {
  const dispenseTxn = await escrowContract.connect(signer).dispense();
  await dispenseTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setAccount(provider.getSigner().getAddress());
        setSigner(provider.getSigner());
      }
    }

    getAccounts();
  }, []);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const depositor = document.getElementById('depositor').value;
    const value = ethers.utils.parseEther(document.getElementById('eth').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, depositor, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      depositor,
      value: ethers.utils.formatEther(value),
      handleApproveDepositor: async () => {
        escrowContract.on('ApprovedByDepositor', () => {
          document.getElementById(escrowContract.address).className = 'complete';
          document.getElementById(escrowContract.address).innerText = "✓ Depositor approved!";
        });

        await approveDepositor(escrowContract, signer);
      },
      handleApproveArbiter: async () => {
        escrowContract.on('ApprovedByArbiter', () => {
          document.getElementById(`arbiter-${escrowContract.address}`).className = 'complete';
          document.getElementById(`arbiter-${escrowContract.address}`).innerText = "✓ Arbiter approved!";
        });

        await approveArbiter(escrowContract, signer);
      },
      handleDispense: async () => {
        escrowContract.on('ApprovedByArbiter', () => {
          document.getElementById(`dispense-${escrowContract.address}`).className = 'complete';
          document.getElementById(`dispense-${escrowContract.address}`).innerText = "✓ It's been dispensed!";
        });

        await dispense(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Depositor Address
          <input type="text" id="depositor" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
