import { 
  FaBrain, 
  FaCogs, 
  FaBullseye, 
  FaChartPie, 
  FaUserCheck, 
  FaHandshake, 
  FaCheck,
  FaArrowRight
} from "react-icons/fa";

function PsychometricAssessment() {
  return (
    <section 
      id="assessment-details" 
      className="py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/25 to-slate-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full space-y-12 md:space-y-16">
        
        {/* Title Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <FaBrain className="text-xs" />
            <span>Scientific Methods</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Scientifically Designed <br />
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">Psychometric Assessment</span>
          </h2>
          <p className="text-slate-600 font-normal leading-relaxed text-sm md:text-base">
            At BTS Career Intelligence & Guidance, rather than relying on guesswork, marks alone, or personal opinions, our assessment evaluates multiple dimensions of an individual's profile to identify suitable academic and career pathways.
          </p>
        </div>

        {/* 3-Column Concept Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: What is Psychometric Assessment? */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-xs hover:shadow-lg hover:border-blue-100 transition duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-700 w-12 h-12 rounded-2xl flex items-center justify-center border border-blue-100/50">
                <FaBrain className="text-xl" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">What is Psychometric Assessment?</h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Psychometric Assessment is a scientific method used to measure an individual's:
              </p>
              <ul className="space-y-2.5 pt-2">
                {[
                  "Aptitude and natural abilities",
                  "Career interests and preferences",
                  "Personality traits",
                  "Learning styles",
                  "Strengths and development areas",
                  "Career inclinations and suitability"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                    <FaCheck className="text-emerald-500 text-xs shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed mt-6 border-t border-slate-50 pt-4">
              These insights help students, parents, and professionals make informed educational and career decisions.
            </p>
          </div>

          {/* Card 2: Reliability */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-xs hover:shadow-lg hover:border-blue-100 transition duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-indigo-50 text-indigo-700 w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-100/50">
                <FaCogs className="text-xl" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Reliability</h3>
              <p className="text-slate-700 text-xs md:text-sm font-bold italic text-blue-600">
                Reliability refers to the consistency of assessment results.
              </p>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed pt-2">
                Our assessment framework uses standardized measurement techniques to ensure that results remain stable, dependable, and meaningful when evaluating an individual's abilities, interests, and personality characteristics.
              </p>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed mt-6 border-t border-slate-50 pt-4">
              This helps provide trustworthy recommendations that can be used confidently for academic and career planning.
            </p>
          </div>

          {/* Card 3: Validity */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-xs hover:shadow-lg hover:border-blue-100 transition duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center border border-emerald-100/50">
                <FaBullseye className="text-xl" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Validity</h3>
              <p className="text-emerald-700 text-xs md:text-sm font-bold italic text-emerald-600">
                Validity refers to how accurately an assessment measures what it is intended to measure.
              </p>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed pt-2">
                Our assessment methodology is designed to evaluate career-related factors such as aptitude, interests, personality, and learning preferences, ensuring that recommendations are relevant and aligned with an individual's natural potential.
              </p>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed mt-6 border-t border-slate-50 pt-4">
              This helps identify career pathways that are better matched to the student's strengths and aspirations.
            </p>
          </div>

        </div>

        {/* 2-Column Advanced Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
          
          {/* Box 1: Multi-Dimensional Career Analysis */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-blue-400 w-fit">
                <FaChartPie className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Multi-Dimensional Career Analysis</h3>
              <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-normal">
                The assessment combines insights from multiple areas to provide a comprehensive view of an individual's potential rather than relying on a single parameter:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {[
                  "Aptitude Analysis",
                  "Personality Profiling",
                  "Interest Assessment",
                  "Learning Style Evaluation",
                  "Career Suitability Mapping",
                  "Future Career Readiness"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                    <FaCheck className="text-emerald-400 text-xs shrink-0" />
                    <span className="text-xs font-semibold text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Personalized Career Recommendations */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100/50 text-blue-600 w-fit">
                <FaUserCheck className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Personalized Career Recommendations</h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Based on the assessment results, students receive actionable roadmaps and resources to support their development:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {[
                  "Detailed Career Intelligence Report",
                  "Strength & Development Analysis",
                  "Suitable Career Path Choices",
                  "Stream Selection Guidance",
                  "Higher Education Planning",
                  "Personalized Career Counselling"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50/20 p-2.5 rounded-xl border border-blue-100/30">
                    <FaArrowRight className="text-blue-500 text-xs shrink-0" />
                    <span className="text-xs font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner: Human Guidance + Scientific Assessment */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Background decoration elements */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform translate-x-10 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <FaHandshake className="text-xs text-yellow-350" />
                <span className="text-white">Expert Mentorship</span>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Human Guidance + Scientific Assessment
              </h3>
              <p className="text-slate-50 text-xs md:text-sm max-w-xl leading-relaxed">
                Technology alone cannot replace expert guidance. Every assessment is supported by professional counselling to help students and parents understand the results and make practical decisions with confidence.
              </p>
            </div>
            
            <div className="md:col-span-4 md:border-l md:border-white/20 md:pl-8 flex flex-col justify-center">
              <p className="text-yellow-300 text-[10px] font-bold uppercase tracking-wider mb-1">Our Core Goal</p>
              <p className="text-sm md:text-base font-extrabold leading-snug italic text-white">
                "Helping every learner understand themselves before choosing their career."
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default PsychometricAssessment;

