import "./App.css";
import ChessChallenge from "./components/chessChallenge";
import ChooseChallenge from "./components/chooseChallenge";
import contractJson from "./contract/contract.json";
import { contractAddress } from "./contract/contractAddress";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import CheckGoal from "./components/checkGoal";
import Navbar from "./components/navbar";
import CreateOwnBet from "./components/createOwnBet";
function App() {
  const [badNetwork, setBadNetwork] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("home");

  useEffect(() => {
    // The "any" network will allow spontaneous network changes
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (newNetwork.chainId === 3) {
        setBadNetwork(false);
      }
      if (oldNetwork) {
        window.location.reload();
      }
    });
    checkNetwork();
  }, []);
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        setBadNetwork(true);
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }], // chainId must be in hexadecimal numbers
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getProvider = async () => {
      try {
        const providerObject = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signerObject = providerObject.getSigner();
        const contractObject = new ethers.Contract(
          contractAddress,
          contractJson.abi,
          signerObject
        );

        setProvider(providerObject);
        setSigner(signerObject);
        setContract(contractObject);

        console.log(provider.provider.on);
      } catch (err) {}
      setLoading(false);
    };
    getProvider();
  }, []);
  const connectWallet = async () => {
    if (provider) {
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
      provider.provider.on("accountsChanged", (accounts) => {
        console.log("test");
        setWallet(accounts[0]);
      });
    } else {
      alert("Please install metamask!");
    }
  };
  return (
    <div className="App">
      <Navbar
        wallet={wallet}
        connectWallet={connectWallet}
        setScreen={setScreen}
        screen={screen}
      />

      {screen === "home" ? (
        <ChooseChallenge setScreen={setScreen} />
      ) : screen === "chessChallenge" ? (
        <ChessChallenge contract={contract} />
      ) : screen === "checkGoal" ? (
        <CheckGoal
          contract={contract}
          wallet={wallet}
          connectWallet={connectWallet}
        />
      ) : screen === "ownChallenge" ? (
        <CreateOwnBet contract={contract} />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
