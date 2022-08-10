import { useState } from "react";
import styled from "styled-components";
import chessIcon from "../assets/chess.png";
import { ethers } from "ethers";

const BetParameters = styled.div`
  margin: 0px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
`;
const BoxContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  margin-top: 100px;
  justify-content: flex-start;
  align-items: center;
`;
const ChallengeBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  transition: 0.25s background-color ease;
  margin-right: 50px;

  &:hover {
    background-color: #1c1c1c;
    cursor: pointer;
  }
`;
const Title = styled.h1`
  font-size: 24px;
  color: white;
`;
const BoxTitle = styled.p``;
const BoxDescription = styled.p``;

const BoxIcon = styled.img`
  width: 150px;
  height: 150px;
`;
const Input = styled.input`
  padding: 12px 5px 12px 5px;
  border-radius: 10px;

  background-color: #ffffff;
  border: none;
  outline: none;
  width: 200px;
`;
const Button = styled.button`
  padding: 10px;
  border: none;
  background-color: #4e9632;
  border-radius: 10px;
  margin-left: 10px;
  color: white;
  &:hover {
    background-color: #4e763b;
    cursor: pointer;
  }
`;
const RatingBox = styled.div`
  width: 100px;
  height: 50px;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  display: flex;
  transition: 0.25s background-color ease;
  border-radius: 10px;
  margin-right: 50px;
  color: #ffffff;
  &:hover {
    background-color: #1c1c1c;
    cursor: pointer;
  }
`;
const WhiteText = styled.p`
  color: white;
`;
const BetButton = styled.button`
  padding: 10px 20px 10px 20px;
  background-color: #4e9632;
  max-height: 250px;
  width: 200px;
  border: none;
  color: #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: 50px;
  transition: 0.25s background-color ease;
  &:hover {
    background-color: #4e763b;
    cursor: pointer;
  }
`;
const CustomInput = styled.input`
  height: 50px;
  color: #ffffff;
  background-color: #000000;
  border: none;
  border-radius: 10px;
  padding: 0 10px 0 10px;
`;
const CreateOwnBet = ({ contract }) => {
  const [betAmount, setBetAmount] = useState(0);
  const [customBet, setCustomBet] = useState(false);

  const border = {
    border: "3px solid #4e763b",
    boxShadow: " 2px 2px 5px black",
  };

  const sendGoal = () => {
    contract.createGoal(99999999999999, 0, 0, 4, "ownGoal", {
      value: ethers.utils.parseEther(String(betAmount)),
    });
  };
  return (
    <MainContainer>
      <BetParameters>
        <Title>How much do you want to bet?</Title>
        <BoxContainer>
          <RatingBox
            onClick={() => setBetAmount(0.01)}
            style={betAmount === 0.01 ? border : {}}
          >
            0.01 Ξ
          </RatingBox>{" "}
          <RatingBox
            onClick={() => setBetAmount(0.1)}
            style={betAmount === 0.1 ? border : {}}
          >
            0.1 Ξ
          </RatingBox>{" "}
          <RatingBox
            onClick={() => setBetAmount(1)}
            style={betAmount === 1 ? border : {}}
          >
            1 Ξ
          </RatingBox>{" "}
          {customBet ? (
            <CustomInput
              onChange={(e) => setBetAmount(e.target.value)}
              type="number"
              placeholder={"enter your bet"}
            />
          ) : (
            <RatingBox onClick={() => setCustomBet(true)}>Custom</RatingBox>
          )}
        </BoxContainer>
        <BoxContainer>
          <p style={{ color: "white" }}>
            {" "}
            This bet works with an honour system. You are the sole referee.{" "}
          </p>
        </BoxContainer>

        <BetButton onClick={sendGoal}>Start the Bet!</BetButton>
      </BetParameters>
    </MainContainer>
  );
};

export default CreateOwnBet;
