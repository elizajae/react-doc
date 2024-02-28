import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [deck, setDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    setDeck(response.data);
    console.log(response.data);
  }

  async function drawCard() {
    if (deck && deck.remaining === 0) {
      alert('Error: no cards remaining!');
      return; 
    }
    else if (deck) { 
      try {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
        const card = response.data.cards[0]; 
        setCurrentCard(card);
        setDeck(prevDeck => ({ ...prevDeck, remaining: response.data.remaining }));
      } catch (error) {
        console.error('Error drawing card:', error);
      }
    }
  }

  async function shuffleDeck() {
    if (deck) {
      try {
        await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
        setCurrentCard(null);
        setDeck(prevDeck => ({ ...prevDeck, remaining: 52 })); 
      } catch (error) {
        console.error('Error shuffling deck:', error);
      }
    }
  }

  return (
  <div className="App">
    <button onClick={drawCard}>Draw a card</button>
    <button onClick={shuffleDeck}>Shuffle deck</button>
    {currentCard && (
      <div>
        <img src={currentCard.image}></img>
      </div>
    )}
  </div>
  );
}

export default App;
