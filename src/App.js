import React from "react";
import "./App.css";
import Card from "./DisplayCards";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: [],
      dealer: null,
      player: null,
      chipCount: 0,
      bet: "",
      gameOver: false,
      message: "",
      playerBet: "",
      playing: false,
      hideDealerCard: true,
    };
  }

  /* create a new Deck */
  createDeck() {
    const deck = [];
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const suits = ["♦️", "♠", "♣️", "♥"];
    for (let i = 0; i < ranks.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({ rank: ranks[i], suit: suits[j] });
      }
    }
    return deck;
  }

  /* deal the initial cards to the player and dealer */ s;
  dealCards(deck) {
    const pCard1 = this.getCard(deck);
    const dCard1 = this.getCard(pCard1.gameDeck);
    const pCard2 = this.getCard(dCard1.gameDeck);
    const dCard2 = this.getCard(pCard2.gameDeck);

    const playerStartingHand = [pCard1.randomCard, pCard2.randomCard];
    const dealerStartingHand = [dCard1.randomCard, dCard2.randomCard];

    const player = {
      cards: playerStartingHand,
      count: this.getCount(playerStartingHand),
    };

    const dealer = {
      cards: dealerStartingHand,
      count: this.getCount(dealerStartingHand),
    };

    const gameDeck = dCard2.gameDeck;

    return { gameDeck, player, dealer };
  }

  /* get a random card from the deck */
  getCard(deck) {
    const gameDeck = deck;
    const i = Math.floor(Math.random() * gameDeck.length);
    const randomCard = gameDeck[i];
    gameDeck.splice(i, 1);
    return { randomCard, gameDeck };
  }

  /* start a new game */
  startNewGame(type) {
    if (type === "continue") {
      if (this.state.chipCount > 0) {
        const deck =
          this.state.deck.length < 13 ? this.createDeck() : this.state.deck;
        const { gameDeck, player, dealer } = this.dealCards(deck);

        this.setState({
          deck: gameDeck,
          dealer,
          player,
          bet: "",
          gameOver: false,
          message: "",
          playing: true,
          hideDealerCard: true,
        });
      } else {
        this.setState({ message: "You are out of chips! Start a new game" });
      }
    } else {
      const deck = this.createDeck();
      const { gameDeck, player, dealer } = this.dealCards(deck);
      this.setState({
        deck: gameDeck,
        dealer,
        player,
        chipCount: 100,
        bet: "",
        gameOver: false,
        message: "",
        playerBet: "",
        playing: true,
        hideDealerCard: true,
      });
    }
  }

  /* count the value of the player and dealer's hands */
  getCount(cards) {
    const allCards = [];
    cards.forEach((card) => {
      if (card.rank === "A") {
        allCards.push(card);
      } else {
        allCards.unshift(card);
      }
    });

    return allCards.reduce((total, card) => {
      if (card.rank === "A") {
        return total + 11 <= 21 ? total + 11 : total + 1;
      } else if (card.rank === "J" || card.rank === "Q" || card.rank === "K") {
        return total + 10;
      } else {
        return total + card.rank;
      }
    }, 0);
  }

  /* handle player hitting */
  hit() {
    if (!this.state.gameOver) {
      if (this.state.bet) {
        const { randomCard, gameDeck } = this.getCard(this.state.deck);
        const player = this.state.player;

        player.cards.push(randomCard);
        player.count = this.getCount(player.cards);

        if (this.state.player.count > 21) {
          this.setState({
            player: player,
            gameOver: true,
            message: "You BUST!",
          });
        } else {
          this.setState({ deck: gameDeck, player: this.state.player });
        }
      } else {
        this.setState({ message: "Please place your bet!" });
      }
    } else {
      this.setState({ message: "Game Over! Start a new game or continue." });
    }
  }

  /* handle player standing */
  stand(deck) {
    if (!this.state.gameOver) {
      if (this.state.bet) {
        // draw cards for dealer until their count is at least 17
        const dealer = this.state.dealer;
        while (dealer.count < 17) {
          const { randomCard, gameDeck } = this.getCard(deck);
          dealer.cards.push(randomCard);
          dealer.count = this.getCount(dealer.cards);
          deck = gameDeck;
        }

        this.setState({
          hideDealerCard: false,
        });

        if (dealer.count > 21) {
          this.setState({
            deck,
            dealer,
            chipCount: this.state.chipCount + this.state.bet * 2,
            gameOver: true,
            message: "Dealer bust! You Win!",
          });
        } else {
          const winner = this.getWinner(this.state.dealer, this.state.player);
          let chipCount = this.state.chipCount;
          let message;

          if (winner === "player") {
            message = "You Win!";
            chipCount += this.state.bet * 2;
          } else if (winner === "dealer") {
            message = "Dealer wins";
          } else {
            message = "Push";
            chipCount += this.state.bet;
          }

          this.setState({
            deck,
            dealer,
            chipCount,
            gameOver: true,
            message,
          });
        }
      } else {
        this.setState({ message: "Please place your bet!" });
      }
    } else {
      this.setState({ message: "Game Over! Start a new game or continue." });
    }
  }

  /* place a bet */
  placebet() {
    const bet = this.state.playerBet;

    if (bet > this.state.chipCount) {
      this.setState({
        message: "You have insufficient chips to bet that amount!",
      });
    } else {
      const chipCount = this.state.chipCount - bet;
      this.setState({ chipCount, playerBet: "", bet });
    }
  }

  /* determine who the winner is */
  getWinner(dealer, player) {
    if (player.count > dealer.count) {
      return "player";
    } else if (dealer.count > player.count) {
      return "dealer";
    } else {
      return "push";
    }
  }

  collectBet(e) {
    const playerBet = +e.target.value;
    this.setState({ playerBet });
  }

  render() {
    return (
      <div>
        <p className="blackjack">Blackjack</p>
        {!this.state.playing ? (
          <div className="startGame">
            <button
              style={{ width: "100px", height: "40px", fontSize: 16 }}
              onClick={() => {
                this.startNewGame();
              }}
            >
              Start Game
            </button>
          </div>
        ) : (
          <div>
            <div className="buttons">
              <button
                style={{
                  width: "100px",
                  height: "40px",
                  fontSize: 16,
                }}
                onClick={() => {
                  this.startNewGame();
                }}
              >
                New Game
              </button>

              <button
                style={{ width: "100px", height: "40px", fontSize: 16 }}
                onClick={() => {
                  this.hit();
                }}
              >
                Hit
              </button>

              <button
                style={{ width: "100px", height: "40px", fontSize: 16 }}
                onClick={() => {
                  this.stand(this.state.deck);
                }}
              >
                Stand
              </button>
            </div>
            <p> Chip Count: {this.state.chipCount}</p>
            {!this.state.bet ? (
              <div className="betInput">
                <form>
                  <input
                    type="text"
                    name="bet"
                    id="bet"
                    value={this.state.playerBet}
                    onChange={this.collectBet.bind(this)}
                  />
                </form>
                <button
                  style={{ width: "100px", height: "40px", fontSize: 16 }}
                  onClick={() => {
                    this.placebet();
                  }}
                >
                  Place Bet
                </button>
              </div>
            ) : null}
            {this.state.gameOver ? (
              <div className="buttons">
                <button
                  style={{
                    width: "100px",
                    height: "40px",
                    fontSize: 16,
                  }}
                  onClick={() => {
                    this.startNewGame("continue");
                  }}
                >
                  Continue
                </button>
              </div>
            ) : null}
            <p>{this.state.message}</p>
            {this.state.bet ? (
              <div>
                <p> Player Hand ({this.state.player.count}): </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {this.state.player.cards.map((card, i) => {
                    return <Card key={i} rank={card.rank} suit={card.suit} />;
                  })}
                </div>
                n
                <p>
                  Dealer Hand (
                  {!this.state.hideDealerCard ? this.state.dealer.count : null}
                  ):
                </p>
                {this.state.hideDealerCard ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Card
                      rank={this.state.dealer.cards[0].rank}
                      suit={this.state.dealer.cards[0].suit}
                    />
                    <Card rank={this.state.dealer.cards[1].rank} suit={null} />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {this.state.dealer.cards.map((card, i) => {
                      return <Card key={i} rank={card.rank} suit={card.suit} />;
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default App;
