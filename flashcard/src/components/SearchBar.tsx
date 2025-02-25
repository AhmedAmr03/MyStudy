import React from "react";
import { Search } from "lucide-react";
export const SearchBar = ({
  onSearch
}) => {
  return <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Search flash cards..." onChange={e => onSearch(e.target.value)} />
    </div>;
};