import { ethers } from "ethers";

const contractAddress = "0xC88B5565A8fA7478E2228B11D2B3C4AC5E28A033";

const abi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "location", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "ownerName", "type": "string" },
      { "indexed": false, "internalType": "address", "name": "ownerWallet", "type": "address" }
    ],
    "name": "LandRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "oldOwner", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "string", "name": "_ownerName", "type": "string" }
    ],
    "name": "registerLand",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" }
    ],
    "name": "getLand",
    "outputs": [
      { "internalType": "uint256", "type": "uint256" },
      { "internalType": "string", "type": "string" },
      { "internalType": "string", "type": "string" },
      { "internalType": "address", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function getContract() {

  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  // 🔥 ensure network is sepolia
  const network = await provider.getNetwork();
  console.log("Connected network:", network);

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    signer
  );

  return contract;
}