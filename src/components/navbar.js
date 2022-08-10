import styled from "styled-components";

const MainContainer = styled.div`
  width: 100%;
  height: 70px;
  background-color: #1d1d1d;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
  box-shadow: 5px 5px 15px black;
`;
const Button = styled.button`
  background-color: #4e9632;
  height: 50px;
  border: none;
  border-radius: 10px;
  color: white;
`;
const Component = styled.p`
  color: #ffffff;
  &:hover {
    cursor: pointer;
  }
`;
const ComponentContainer = styled.div`
  display: flex;
  width: 350px;
  justify-content: space-around;
  font-weight: 600;
`;
const Navbar = ({ connectWallet, wallet, setScreen, screen }) => {
  return (
    <MainContainer>
      <ComponentContainer>
        <Component onClick={() => setScreen("home")}>
          Create a new Goal
        </Component>

        <Component onClick={() => setScreen("checkGoal")}>
          Claim your Goal
        </Component>
      </ComponentContainer>

      {wallet ? (
        <Component>{wallet.slice(0, 6)}...</Component>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </MainContainer>
  );
};

export default Navbar;
