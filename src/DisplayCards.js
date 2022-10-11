import styled from "styled-components";

/* map cards to the unicode representation of cards */
const spadesMap = new Map([
  [2, "🂢"],
  [3, "🂣"],
  [4, "🂤"],
  [5, "🂥"],
  [6, "🂦"],
  [7, "🂧"],
  [8, "🂨"],
  [9, "🂩"],
  [10, "🂪"],
  ["J", "🂫"],
  ["Q", "🂭"],
  ["K", "🂮"],
  ["A", "🂡"],
]);

const clubsMap = new Map([
  [2, "🃒"],
  [3, "🃓"],
  [4, "🃔"],
  [5, "🃕"],
  [6, "🃖"],
  [7, "🃗"],
  [8, "🃘"],
  [9, "🃙"],
  [10, "🃚"],
  ["J", "🃛"],
  ["Q", "🃝"],
  ["K", "🃞"],
  ["A", "🃑"],
]);

const heartsMap = new Map([
  [2, "🂲"],
  [3, "🂳"],
  [4, "🂴"],
  [5, "🂵"],
  [6, "🂶"],
  [7, "🂷"],
  [8, "🂸"],
  [9, "🂹"],
  [10, "🂺"],
  ["J", "🂻"],
  ["Q", "🂽"],
  ["K", "🂾"],
  ["A", "🂱"],
]);

const diamondsMap = new Map([
  [2, "🃂"],
  [3, "🃃"],
  [4, "🃄"],
  [5, "🃅"],
  [6, "🃆"],
  [7, "🃇"],
  [8, "🃈"],
  [9, "🃉"],
  [10, "🃊"],
  ["J", "🃋"],
  ["Q", "🃍"],
  ["K", "🃎"],
  ["A", "🃁"],
]);

const RedCard = styled.div`
  color: red;
  font-size: 11rem;
  display: flex;
  justify-content: center;
`;

const BlackCard = styled.div`
  color: grey;
  font-size: 11rem;
  display: flex;
  justify-content: center;
`;

const Card = ({ suit, rank }) => {
  if (suit == "♠") {
    return <BlackCard>{spadesMap.get(rank)}</BlackCard>;
  } else if (suit == "♣️") {
    return <BlackCard>{clubsMap.get(rank)}</BlackCard>;
  } else if (suit == "♥") {
    return <RedCard>{heartsMap.get(rank)}</RedCard>;
  } else if (suit == "♦️") {
    return <RedCard>{diamondsMap.get(rank)}</RedCard>;
  }
};

export default Card;
