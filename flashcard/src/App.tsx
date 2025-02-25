import React, { useEffect, useState } from "react";
import { Navigation } from "./components/Navigation";
import { FlashCardGrid } from "./components/FlashCardGrid";
import { SearchBar } from "./components/SearchBar";
import { FileUpload } from "./components/FileUpload";
import { ThemeToggle } from "./components/ThemeToggle";
import { useLocalStorage } from "./hooks/useLocalStorage";
export function App() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [currentSubject, setCurrentSubject] = useState("commercial");
  const [searchQuery, setSearchQuery] = useState("");
  const [flashcards, setFlashcards] = useLocalStorage("flashcards", []);
  const handleFileUpload = newCards => {
    setFlashcards(prevCards => [...prevCards, ...newCards]);
  };
  return <div className={`min-h-screen w-full ${theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Flash Cards
            </h1>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
          <Navigation currentSubject={currentSubject} setCurrentSubject={setCurrentSubject} />
          <div className="mt-6 flex gap-4 items-center">
            <SearchBar onSearch={setSearchQuery} />
            <FileUpload onUpload={handleFileUpload} />
          </div>
        </header>
        <main>
          <FlashCardGrid subject={currentSubject} searchQuery={searchQuery} cards={flashcards} />
        </main>
      </div>
    </div>;
}