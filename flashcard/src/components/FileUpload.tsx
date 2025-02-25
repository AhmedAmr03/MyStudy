import React, { useState, useRef, createElement } from "react";
import { Upload, Loader, Download, HelpCircle } from "lucide-react";
const sampleData = {
  commercial: [{
    text: "تعريف اعمال المصرفيه (البنوك)",
    number: 231,
    description: "هي كل نشاط يتناول بشكل اساسي واعتيادي قبول الودائع والحصول على التمويل واستثمار بك الاموال في تقديم التمويل وتسهيلات الائتمانيه.",
    priority: "articles"
  }],
  tax: [],
  terms: [],
  principles: [],
  arbitration: [],
  aviation: []
};
export const FileUpload = ({
  onUpload
}) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const transformData = data => {
    const transformedCards = [];
    Object.entries(data).forEach(([subject, cards]) => {
      if (Array.isArray(cards)) {
        cards.forEach((card, index) => {
          if (card.text && card.description !== undefined) {
            transformedCards.push({
              id: `${Date.now()}-${subject}-${index}`,
              title: card.text,
              description: card.description.replace(/\\n/g, "\n"),
              number: card.number?.toString() || `${index + 1}`,
              subject: subject,
              isMarked: card.priority === "articles" || card.priority === "special"
            });
          }
        });
      }
    });
    return transformedCards;
  };
  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    setError("");
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") {
        throw new Error("Invalid JSON format. Expected an object with subject categories.");
      }
      const validSubjects = ["commercial", "tax", "terms", "principles", "arbitration", "aviation"];
      const hasValidStructure = Object.keys(data).some(key => validSubjects.includes(key) && Array.isArray(data[key]));
      if (!hasValidStructure) {
        throw new Error("Invalid data structure. The JSON must contain subject categories with arrays of flashcards.");
      }
      const transformedData = transformData(data);
      if (transformedData.length === 0) {
        throw new Error("No valid flashcards found in the file.");
      }
      onUpload(transformedData);
      event.target.value = null;
    } catch (err) {
      setError(err.message);
      console.error("Error processing file:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadSample = () => {
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-flashcards.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return <div className="relative">
      <div className="flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
          {isLoading ? <Loader className="h-5 w-5 mr-2 animate-spin" /> : <Upload className="h-5 w-5 mr-2" />}
          {isLoading ? "Uploading..." : "Upload"}
        </button>
        
        <div className="relative">
          <button onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="p-2 text-gray-500 hover:text-gray-700">
            <HelpCircle className="h-5 w-5" />
          </button>
          {showTooltip && <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg w-64 z-10">
              Upload a JSON file with subject categories. Each flashcard should
              have:
              <ul className="mt-1 list-disc list-inside">
                <li>text (title)</li>
                <li>description</li>
                <li>number (optional)</li>
                <li>priority (optional)</li>
              </ul>
            </div>}
        </div>
      </div>
      {error && <div className="absolute top-full left-0 mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>}
    </div>;
};