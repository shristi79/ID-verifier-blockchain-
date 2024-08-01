document.addEventListener('DOMContentLoaded', () => {
  const connectButton = document.getElementById('connectButton');
  const submitButton = document.getElementById('submitIdentity');
  const nameInput = document.getElementById('nameInput');
  const ageInput = document.getElementById('ageInput');
  const addressInput = document.getElementById('addressInput');
  const statusMessage = document.getElementById('status');

  // Contract address and ABI (replace with your contract details)
  const contractAddress = '0x6A3230980fc2fAEEe44C948AEC0001e66646b0af';
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "addressInfo",
          "type": "string"
        }
      ],
      "name": "IdentitySet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "IdentityVerified",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "identities",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "addressInfo",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "verified",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_addressInfo",
          "type": "string"
        }
      ],
      "name": "setIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_addressInfo",
          "type": "string"
        }
      ],
      "name": "verifyIdentity",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Check if Web3 provider (MetaMask) is available
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Add click event listener to Connect button
      connectButton.addEventListener('click', async () => {
        // Request account access if needed
        await window.ethereum.enable();
        const accounts = await window.web3.eth.getAccounts();
        console.log('Connected to MetaMask:', accounts[0]);
        // Once connected, enable the form for identity submission
        document.getElementById('identityForm').style.pointerEvents = 'auto';
        document.getElementById('submitIdentity').disabled = false;
      });

      // Add click event listener to Submit button in identity form
      submitButton.addEventListener('click', async () => {
        console.log('Set Identity button clicked');
        const name = nameInput.value.trim();
        const age = parseInt(ageInput.value);
        const addressInfo = addressInput.value.trim();

        if (name && age && addressInfo) {
          try {
            const contract = new window.web3.eth.Contract(contractABI, contractAddress);
            const accounts = await window.ethereum.enable();
            console.log('Connected Account:', accounts[0]);

            const transaction = await contract.methods.setIdentity(name, age, addressInfo).send({ from: accounts[0] });
            console.log('Transaction:', transaction);
            statusMessage.textContent = 'Identity set successfully!';
          } catch (error) {
            console.error('Error setting identity:', error);
            statusMessage.textContent = 'Error setting identity. Please try again.';
          }
        } else {
          statusMessage.textContent = 'Please fill out all fields.';
        }
      });
    } catch (error) {
      console.error('User denied account access:', error);
    }
  } else {
    console.error('MetaMask not detected');
  }
});
