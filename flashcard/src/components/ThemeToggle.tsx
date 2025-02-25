import React from "react";
import { Sun, Moon } from "lucide-react";
export const ThemeToggle = ({
  theme,
  setTheme
}) => {
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      {theme === "light" ? <Moon className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-yellow-400" />}
    </button>;
};