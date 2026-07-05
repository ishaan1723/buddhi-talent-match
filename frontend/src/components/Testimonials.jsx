import { useState, useEffect } from "react";
import { fetchGoogleSheetData } from "../utils/googleSheets";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Sangita (standard -12) student",
    subtitle: "Career Guidance Assessment",
    text: "The career guidance assessment helped me gain clarity about my interests, strengths, and future opportunities. The report suggested suitable career paths and highlighted areas for improvement. It is especially useful for students who are confused after Class 10 and Class 12.",
    initials: "S",
  },
  {
    name: "Amaratji Thakor - Parent",
    subtitle: "Psychometric Assessment for Child",
    text: "The psychometric assessment helped us better understand our child's capabilities, interests, and future direction. The guidance was based on aptitude, personality, and strengths rather than just marks. The report was simple to understand and extremely helpful.",
    initials: "AT",
  },
  {
    name: "Ankur Shrimali",
    subtitle: "Stream Selection Guidance",
    text: "We were confused about which stream would be best after Class 10. The Scientific Psychometric Test provided detailed insights into strengths, interests, decision-making abilities, and career suitability. The report gave us confidence in making the right academic decision.",
    initials: "AS",
  },
];

const videoTestimonials = [
  {
    src: "/testimonial-1.mp4",
    title: "Sangita (std 12th Student)",
    subtitle: "Career Guidance Assessment",
  },
  {
    src: "/testimonial--2.mp4",
    title: "Amaratji Thakor (Parent)",
    subtitle: "Psychometric Assessment Feedback",
  },
  {
    src: "/testimonial-3.mp4",
    title: "Ankur Shrimali",
    subtitle: "Stream Selection Guidance",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function VideoCard({ src, title, subtitle }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 aspect-[9/16] w-full max-h-[480px] overflow-hidden">
        {!hasError ? (
          <>
            {/* Loading shimmer shown until video metadata loads */}
            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-blue-400 z-10 pointer-events-none">
                <div className="w-14 h-14 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
                <p className="text-sm text-blue-400 font-medium">Loading video…</p>
              </div>
            )}
            <video
              controls
              onLoadedMetadata={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              preload="metadata"
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          </>
        ) : (
          /* Fallback placeholder when video file is missing */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Video Coming Soon</p>
              <p className="text-xs text-gray-400 mt-1">This testimonial video will be available shortly.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center border-t border-gray-100">
        <h4 className="font-semibold text-gray-900 text-base leading-snug">{title}</h4>
        <p className="text-sm text-blue-500 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || "";

function Testimonials() {
  const [list, setList] = useState(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    if (SHEET_ID) {
      fetchGoogleSheetData(SHEET_ID, "Testimonials").then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            name: item.name || "",
            subtitle: item.subtitle || "",
            text: item.text || "",
            initials: item.initials || (item.name ? item.name.charAt(0).toUpperCase() : "T"),
          }));
          setList(formatted);
        }
      });
    }
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Success Stories &amp; Feedback
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            What students and parents say about BTS Career Guidance Services.
          </p>
        </div>

        {/* Written testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((item) => (
            <div
              key={item.name}
              className="bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <StarRating />

              <p className="text-gray-600 leading-relaxed text-sm flex-1 italic">
                "{item.text}"
              </p>

              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {item.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-blue-500 text-xs font-medium">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video testimonials */}
        <div className="mt-24">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              Video Stories
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Hear It From Them Directly
            </h3>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Real experiences shared by students and parents about their journey with BTS.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 items-start">
            {videoTestimonials.map((v) => (
              <VideoCard key={v.src} {...v} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;
