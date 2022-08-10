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
const ChessChallenge = ({ contract }) => {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [userStats, setUserStats] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [ratingGoal, setRatingGoal] = useState("");

  const [timePeriod, setTimePeriod] = useState(0);
  const [betAmount, setBetAmount] = useState(0);

  const [chessMode, setChessMode] = useState("");
  const [customRating, setCustomRating] = useState(false);
  const [customBet, setCustomBet] = useState(false);

  const [customDate, setCustomDate] = useState(false);

  const border = {
    border: "3px solid #4e763b",
    boxShadow: " 2px 2px 5px black",
  };

  const getChessMode = (chessMode) => {
    if (chessMode === 0) return "chess_bullet";
    if (chessMode === 1) return "chess_blitz";
    if (chessMode === 2) return "chess_rapid";
  };
  const searchUser = async () => {
    try {
      const user = await (
        await fetch(`https://api.chess.com/pub/player/${username}`)
      ).json();
      const userStats = await (
        await fetch(`https://api.chess.com/pub/player/${username}/stats`)
      ).json();

      if (user.code === 0) {
        setErrMessage("User not found");
        console.log(user);
        setUserInfo("");
        setUserStats("");
      } else {
        setUserInfo(user);
        setUserStats(userStats);
        setErrMessage("");
        setRatingGoal(0);
        setTimePeriod("");
        setBetAmount(0);
        setChessMode("");
      }
    } catch (err) {
      console.log(err);
      setErrMessage("User not found");
    }
  };

  const getTheDate = (days) => {
    const date = new Date();
    const expectedTime = date.getTime() + days * 24 * 60 * 60 * 1000;
    const expectedDate = new Date(expectedTime);
    return expectedDate;
  };
  const sendGoal = () => {
    const timeStamp =
      timePeriod === 7 || timePeriod === 15 || timePeriod === 30
        ? getTheDate(timePeriod).getTime()
        : new Date(timePeriod).getTime();
    const rating =
      userStats[getChessMode(chessMode)].last.rating + Number(ratingGoal);
    contract.createGoal(
      (timeStamp / 1000).toFixed(0),
      rating,
      userInfo.player_id,
      chessMode,
      userInfo.username,
      {
        value: ethers.utils.parseEther(String(betAmount)),
      }
    );
    console.log(
      (timeStamp / 1000).toFixed(0),
      timeStamp,
      rating,
      userInfo.username,
      userInfo.player_id
    );
  };
  return (
    <MainContainer>
      <SearchContainer>
        <Input
          placeholder={"Enter your chess.com username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={searchUser}>Search</Button>
      </SearchContainer>
      {errMessage}
      {userInfo ? (
        <BetParameters>
          <Title>Choose the Type of Chess</Title>
          <BoxContainer>
            <ChallengeBox
              onClick={() => setChessMode(0)}
              style={chessMode === 0 ? border : {}}
            >
              <WhiteText>Bullet</WhiteText>{" "}
              <WhiteText>{userStats?.chess_bullet?.last.rating}</WhiteText>
            </ChallengeBox>
            <ChallengeBox
              onClick={() => setChessMode(1)}
              style={chessMode === 1 ? border : {}}
            >
              <WhiteText>Blitz</WhiteText>
              <WhiteText>{userStats?.chess_blitz?.last.rating}</WhiteText>
            </ChallengeBox>
            <ChallengeBox
              onClick={() => setChessMode(2)}
              style={chessMode === 2 ? border : {}}
            >
              <WhiteText>Rapid</WhiteText>
              <WhiteText>{userStats?.chess_rapid?.last.rating} </WhiteText>
            </ChallengeBox>
          </BoxContainer>
          <Title>By how much do you want to improve your rating?</Title>
          <BoxContainer>
            <RatingBox
              onClick={() => setRatingGoal(50)}
              style={ratingGoal === 50 ? border : {}}
            >
              +50
            </RatingBox>{" "}
            <RatingBox
              onClick={() => setRatingGoal(100)}
              style={ratingGoal === 100 ? border : {}}
            >
              +100
            </RatingBox>{" "}
            <RatingBox
              onClick={() => setRatingGoal(200)}
              style={ratingGoal === 200 ? border : {}}
            >
              +200
            </RatingBox>{" "}
            {customRating ? (
              <CustomInput
                onChange={(e) => setRatingGoal(e.target.value)}
                type="number"
                placeholder={"enter your goal"}
              />
            ) : (
              <RatingBox onClick={() => setCustomRating(true)}>
                Custom
              </RatingBox>
            )}
          </BoxContainer>
          <p style={{ color: "white" }}>
            {" "}
            Rating Goal:{" "}
            {!isNaN(
              userStats[getChessMode(chessMode)]?.last.rating +
                Number(ratingGoal)
            )
              ? userStats[getChessMode(chessMode)]?.last.rating +
                Number(ratingGoal)
              : ""}{" "}
          </p>
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
          <Title>What is your deadline?</Title>
          <BoxContainer>
            <RatingBox
              onClick={() => setTimePeriod(7)}
              style={timePeriod === 7 ? border : {}}
            >
              7 days
            </RatingBox>{" "}
            <RatingBox
              onClick={() => setTimePeriod(15)}
              style={timePeriod === 15 ? border : {}}
            >
              15 days
            </RatingBox>{" "}
            <RatingBox
              onClick={() => setTimePeriod(30)}
              style={timePeriod === 30 ? border : {}}
            >
              30 days
            </RatingBox>{" "}
            {customDate ? (
              <input
                onChange={(e) => setTimePeriod(e.target.value)}
                type="date"
                placeholder={"enter your date"}
              />
            ) : (
              <RatingBox onClick={() => setCustomDate(true)}>Custom</RatingBox>
            )}
          </BoxContainer>
          {betAmount && ratingGoal && timePeriod ? (
            <p style={{ color: "white" }}>
              You are betting {betAmount} eth that you will improve your rating
              by {ratingGoal} by{" "}
              {timePeriod === 7 || timePeriod === 15 || timePeriod === 30 ? (
                <>
                  {getTheDate(timePeriod).getFullYear()}-
                  {getTheDate(timePeriod).getMonth() + 1}-
                  {getTheDate(timePeriod).getDate()}
                </>
              ) : (
                timePeriod
              )}
            </p>
          ) : (
            ""
          )}
          <BetButton onClick={sendGoal}>Start the Bet!</BetButton>
        </BetParameters>
      ) : (
        ""
      )}
    </MainContainer>
  );
};

export default ChessChallenge;
