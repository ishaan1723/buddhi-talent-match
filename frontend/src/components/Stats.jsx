import { useState, useEffect } from "react";
import { fetchGoogleSheetData } from "../utils/googleSheets";

const FALLBACK_STATS = [
  {
    title: "✅ 350+ Students Assessed",
    description:
      "Helping learners make informed academic and career decisions.",
  },
  {
    title: "✅ 120+ Career Reports Generated",
    description:
      "Personalized assessment reports supporting career clarity.",
  },
  {
    title: "✅ 95% Parent Satisfaction",
    description:
      "Positive feedback from parents and educational stakeholders.",
  },
  {
    title: "✅ Many Schools & Coaching Centres Contacted",
    description:
      "Building partnerships to support student success and guidance.",
  },
];

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || "";

function Stats() {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    if (SHEET_ID) {
      fetchGoogleSheetData(SHEET_ID, "Stats").then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            title: item.title || "",
            description: item.description || "",
          }));
          setStats(formatted);
        }
      });
    }
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Our Impact
          </h2>

          <p className="text-gray-600">
            Supporting students, parents and institutions through career intelligence and guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center"
            >
              <h3 className="text-xl font-bold text-blue-600 mb-4">
                {stat.title}
              </h3>

              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;