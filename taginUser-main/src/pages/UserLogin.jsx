import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserLogin = ({ setUserAddress }) => {
  const [web3, setWeb3] = useState(null);
  const [status, setStatus] = useState("Connect your wallet to continue");
  const navigate = useNavigate();

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "https://sepolia.infura.io/v3/dcef80d47f6e40e6a8ee736c8ed444e2", // replace with your Infura ID
      },
    },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: false, // ensures wallet selection each time
    providerOptions,
  });

  useEffect(() => {
    if (!window.ethereum) {
      setStatus("⚠️ No Ethereum wallet detected.");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const provider = await web3Modal.connect();

      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      const account = accounts[0];

      setUserAddress(account);
      setStatus("✅ Wallet connected. Redirecting...");

      setTimeout(() => navigate("/Inventory"), 1000);
    } catch (err) {
      setStatus(`⚠️ Login failed: ${err.message}`);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-6"
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "linear-gradient(90deg, #f7f7f7 1px, transparent 1px), linear-gradient(180deg, #f7f7f7 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-md w-[400px] flex flex-col items-center space-y-6 border border-gray-200">
        <FaEthereum className="text-gray-800 text-4xl" />
        <h1 className="text-2xl font-semibold text-gray-900">User Login</h1>
        <p className="text-sm text-center text-gray-600">{status}</p>

        <button
          onClick={handleLogin}
          className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-4 rounded-lg transition w-full"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default UserLogin;