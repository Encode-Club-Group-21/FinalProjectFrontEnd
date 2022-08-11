import styled from "styled-components";
import chessIcon from "../assets/Chess-pana.png";
import aloneIcon from "../assets/Alone-pana.png";
const BoxContainer = styled.div`
  display: flex;
  width: 70%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: flex-start;
  align-items: center;
`;
const ChallengeBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 250px;
  height: 250px;
  background-color: #f1f1f1;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: all 0.25s ease;
  box-shadow: 2px 2px 10px black;
  &:hover {
    background-color: #ffffff;
    cursor: pointer;
  }
  margin-right: 50px;
`;
const Title = styled.h1`
  font-size: 26px;
  margin-bottom: 100px;
  color: #ffffff;
`;
const BoxTitle = styled.p`
  margin: 0px;
  font-size: 18px;
  font-weight: 600;
`;
const BoxDescription = styled.p`
  margin: 0px;
  font-size: 14px;
  width: 90%;
`;

const BoxIcon = styled.img`
  width: 150px;
  height: 150px;
`;
const ChooseChallenge = ({ setScreen }) => {
  return (
    <MainContainer>
      <Title>Choose a New Goal</Title>
      <BoxContainer>
        <ChallengeBox onClick={() => setScreen("chessChallenge")}>
          <BoxIcon src={chessIcon} />
          <BoxTitle>Chess</BoxTitle>
          <BoxDescription>Bet that you can improve your rating!</BoxDescription>
        </ChallengeBox>
        <ChallengeBox onClick={() => setScreen("ownChallenge")}>
          {" "}
          <BoxIcon src={aloneIcon} />
          <BoxTitle>Make your Own bet</BoxTitle>
          <BoxDescription>
            Follow the honor system and manage your bet on your own.{" "}
          </BoxDescription>
        </ChallengeBox>
      </BoxContainer>
    </MainContainer>
  );
};

export default ChooseChallenge;
