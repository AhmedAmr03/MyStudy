import React, { useState } from "react";
import { FlashCard } from "./FlashCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
export const FlashCardGrid = ({
  subject,
  searchQuery,
  cards = []
}) => {
  const filteredCards = cards.filter(card => {
    const matchesSubject = card.subject.toLowerCase() === subject.toLowerCase();
    const matchesSearch = searchQuery ? card.title.toLowerCase().includes(searchQuery.toLowerCase()) || card.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesSubject && matchesSearch;
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const goToNextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  if (filteredCards.length === 0) {
    return <div className="col-span-full text-center py-8 text-gray-500">
        {cards.length === 0 ? "Upload some flashcards to get started!" : "No matching flashcards found."}
      </div>;
  }
  const currentCard = filteredCards[currentCardIndex];
  return <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto">
        <FlashCard key={currentCard.id} title={currentCard.title} number={currentCard.number || currentCard.id} description={currentCard.description} isMarked={currentCard.isMarked} onMark={() => {}} />
      </div>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button onClick={goToPreviousCard} disabled={currentCardIndex === 0} className={`p-2 rounded-full ${currentCardIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Card {currentCardIndex + 1} of {filteredCards.length}
        </span>
        <button onClick={goToNextCard} disabled={currentCardIndex === filteredCards.length - 1} className={`p-2 rounded-full ${currentCardIndex === filteredCards.length - 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>;
};