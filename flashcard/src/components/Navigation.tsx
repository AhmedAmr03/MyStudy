import React from "react";
const subjects = [{
  id: "commercial",
  name: "",
  arabicName: "التجارى",
  color: "indigo"
}, {
  id: "tax",
  name: "",
  arabicName: "التشريع الضريبى",
  color: "emerald"
}, {
  id: "terms",
  name: "",
  arabicName: "المصطلحات",
  color: "violet"
}, {
  id: "principles",
  name: "",
  arabicName: "اصول الفقه",
  color: "rose"
}, {
  id: "arbitration",
  name: "",
  arabicName: "حماية البيئة",
  color: "amber"
}, {
  id: "aviation",
  name: "",
  arabicName: "القانون البحرى و الجوى",
  color: "sky"
}];
export const Navigation = ({
  currentSubject,
  setCurrentSubject
}) => {
  return <nav className="flex flex-wrap gap-2">
      {subjects.map(subject => <button key={subject.id} onClick={() => setCurrentSubject(subject.id)} className={`px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md ${currentSubject === subject.id ? `bg-${subject.color}-600 text-white ring-2 ring-${subject.color}-500 ring-offset-2` : `bg-white hover:bg-${subject.color}-50 text-${subject.color}-700 border border-${subject.color}-200`}`}>
          <span className="block text-sm font-medium">{subject.name}</span>
          <span className="block text-xs mt-0.5">{subject.arabicName}</span>
        </button>)}
    </nav>;
};