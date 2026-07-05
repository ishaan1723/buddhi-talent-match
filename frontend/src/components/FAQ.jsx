import { useState, useEffect } from "react";
import { fetchGoogleSheetData } from "../utils/googleSheets";

const FALLBACK_FAQS = [
  {
    question: "Who can take the Career Clarity Assessment?",
    answer: "Students from Class 8 onwards, college students, and professionals."
  },
  {
    question: "How is the assessment conducted?",
    answer: "The assessment is conducted online and followed by a detailed report."
  },
  {
    question: "In which languages is the assessment available?",
    answer: "English, Hindi, and Gujarati."
  },
  {
    question: "What is the starting price?",
    answer: "The Career Clarity Assessment starts from ₹499."
  }
];

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || "";

function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);

  useEffect(() => {
    if (SHEET_ID) {
      fetchGoogleSheetData(SHEET_ID, "FAQs").then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            question: item.question || "",
            answer: item.answer || "",
          }));
          setFaqs(formatted);
        }
      });
    }
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h3 className="font-semibold text-lg mb-2">
                {faq.question}
              </h3>

              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default FAQ;