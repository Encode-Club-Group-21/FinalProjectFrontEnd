import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import chessIcon from "../assets/Leader-rafiki.png";

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const GoalContainer = styled.div`
  width: 300px;
  height: 500px;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: "center";
  box-shadow: 1px 1px 5px black;
  border-radius: 10px;
`;
const Button = styled.button`
  background-color: #4e9632;
  padding: 12px;
  width: 150px;
  border: none;
  color: #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: 0.25s background-color ease;
  &:hover {
    background-color: #4e763b;
    cursor: pointer;
  }
`;
const Label = styled.p`
  background-color: #000000;
  padding: 5px;
  color: white;
  border-radius: 5px;
  box-shadow: 1px 1px 2px black;
`;
const Parameters = styled.p`
  margin: 2px;
`;
const CheckGoal = ({ contract, wallet, connectWallet }) => {
  const [goal, setGoal] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const updateRating = () => {
    console.log(contract);
    const chessMode = goal.typeOfChess.toNumber();

    let path = "";
    if (chessMode === 0) path = "chess_bullet,last,rating";
    if (chessMode === 1) path = "chess_blitz,last,rating";
    if (chessMode === 2) path = "chess_rapid,last,rating";
    let urlStats = `https://api.chess.com/pub/player/${goal.username}/stats`;
    let url = `https://api.chess.com/pub/player/${goal.username}`;
    console.log(path);
    contract.requestMultipleParameters(url, "player_id", urlStats, path);
  };

  const getChessMode = () => {
    if (goal.typeOfChess.toNumber() === 0) return "chess_bullet";
    if (goal.typeOfChess.toNumber() === 1) return "chess_blitz";
    if (goal.typeOfChess.toNumber() === 2) return "chess_rapid";
  };
  useEffect(() => {
    const setTheGoal = async () => {
      if (wallet) {
        const goal = await contract.userToGoal(wallet);
        setGoal(goal);
      }
    };
    setTheGoal();
  }, [wallet]);

  const getRating = async () => {
    const userStats = await (
      await fetch(`https://api.chess.com/pub/player/${goal.username}/stats`)
    ).json();
    if (!userStats.code) {
      setUserStats(userStats);
    }
    console.log(userStats);
  };
  const calculateOneHour = () => {
    const date = new Date();
    return date.getTime() - goal.startDate * 1000 > 3600000 ? true : false;
  };
  useEffect(() => {
    if (goal) getRating();
  }, [goal, wallet]);
  return (
    <MainContainer>
      {!wallet ? (
        <Button onClick={() => connectWallet()}>Connect Wallet</Button>
      ) : goal?.typeOfChess.toNumber() === 4 ? (
        <GoalContainer>
          <img src={chessIcon} style={{ width: "250px" }} />
          <Parameters>
            Bet amount: {ethers.utils.formatEther(goal?.betAmount.toString())} Ξ
          </Parameters>
          {goal.claimed ? (
            "The goal was already claimed"
          ) : (
            <Button onClick={() => contract.claimGoal()}>Claim</Button>
          )}
        </GoalContainer>
      ) : !goal?.goal.toNumber() > 0 ? (
        <Label>You do not have a goal!</Label>
      ) : (
        <GoalContainer>
          <img src={chessIcon} style={{ width: "250px" }} />
          <Parameters>
            Bet amount: {ethers.utils.formatEther(goal?.betAmount.toString())} Ξ
          </Parameters>
          <Parameters>Rating goal: {goal?.goal.toString()}</Parameters>

          <Parameters>
            Current rating:{" "}
            {userStats && userStats[getChessMode()]?.last.rating}
          </Parameters>
          <Parameters>Chess mode: {getChessMode()}</Parameters>
          <Parameters>
            Deadline : {new Date(goal.date.toNumber() * 1000).getDate()}-
            {new Date(goal.date.toNumber() * 1000).getMonth() + 1}-
            {new Date(goal.date.toNumber() * 1000).getFullYear()}
          </Parameters>
          {goal.achievedGoal.toNumber() < goal.goal.toNumber() && userStats ? (
            userStats[getChessMode()].last.rating >= goal.goal ? (
              <>
                <Button
                  onClick={updateRating}
                  disabled={
                    Number(userStats[getChessMode()].last.rating) <
                    Number(goal.goal.toNumber())
                  }
                >
                  Update!{" "}
                </Button>
                {calculateOneHour() ? (
                  ""
                ) : (
                  <Button
                    style={{ backgroundColor: "rgba(255,30,30,1)" }}
                    onClick={() => contract.cancelGoal()}
                  >
                    Cancel goal
                  </Button>
                )}
              </>
            ) : (
              <>
                <Label>You have not achieved your goal yet</Label>
                {calculateOneHour() ? (
                  ""
                ) : goal.claimed ? (
                  "Goal was cancelled"
                ) : (
                  <Button
                    onClick={() => contract.cancelGoal()}
                    style={{ backgroundColor: "rgba(255,30,30,1)" }}
                  >
                    Cancel goal
                  </Button>
                )}
              </>
            )
          ) : !goal.claimed ? (
            <>
              <Button onClick={() => contract.claimGoal()}>Claim</Button>
            </>
          ) : (
            "Already claimed"
          )}
        </GoalContainer>
      )}
    </MainContainer>
  );
};

export default CheckGoal;
