import { 
  FaUserMd, 
  FaLaptopCode, 
  FaCalculator, 
  FaDraftingCompass, 
  FaGavel, 
  FaPalette, 
  FaLightbulb, 
  FaEllipsisH,
  FaCheckCircle,
  FaFileDownload,
  FaShieldAlt,
  FaUsers,
  FaFileAlt,
  FaHeadset,
  FaCompass,
  FaRoute,
  FaKey,
  FaSun,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";
import careerBanner from "../assets/career_banner.png";
import { useSettings } from "../utils/SettingsContext";

function Hero() {
  const { phone, email } = useSettings();

  return (
    <section
      id="home"
      className="bg-gradient-to-b from-blue-50/70 via-sky-50/20 to-white pt-6 pb-12 md:pt-14 md:pb-16 flex flex-col items-center leading-tight overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right Column (Family Banner & Career Grid) - Visible on top on mobile */}
          <div className="lg:col-span-6 order-1 lg:order-2 w-full space-y-6 lg:pl-4">
            
            {/* Family Image Frame with gentle floating animation (now on top!) */}
            <div className="relative bg-white p-2.5 rounded-3xl shadow-xl border border-slate-100/85 overflow-hidden animate-float hover:shadow-2xl transition duration-500">
              <img
                src={careerBanner}
                alt="Career Assessment Guidance - Son, Mother, and Sister"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>

            {/* Header Text for Career Grid */}
            <div className="space-y-1 pt-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Discover Your Strengths.
              </h2>
              <p className="text-slate-900 font-extrabold text-lg md:text-xl tracking-tight">
                Choose Your Best Path.
              </p>
              <div className="inline-block border-b-2 border-emerald-500 pb-1 pr-6">
                <span className="text-emerald-600 font-bold text-sm tracking-wide">Right Career. Better Future.</span>
              </div>
            </div>

            {/* Circular Icons Careers Grid */}
            <div className="grid grid-cols-4 gap-4 py-1">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaUserMd className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">Doctor</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaLaptopCode className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">Engineer</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaCalculator className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">CA</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaDraftingCompass className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">Architect</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaGavel className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">Lawyer</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaPalette className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">Designer</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaLightbulb className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">Entrepreneur</span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300 shadow-xs border border-blue-100/50">
                  <FaEllipsisH className="text-xl" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 text-center mt-2 transition-colors duration-300">and more...</span>
              </div>
            </div>
            
          </div>

          {/* Left Column: Copy & Core Actions */}
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-6 lg:mt-2">
            
            {/* Title & Subtitle */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                Understand Yourself <br />
                Before Choosing <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Career</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Scientific Career Assessment, Expert Guidance and Mentorship to help you make the right academic and career decisions.
              </p>
            </div>

            {/* Checklist */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-700 text-xs md:text-sm font-semibold border-b border-slate-100 pb-5">
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition duration-250">
                <FaCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                <span>Aptitude Analysis</span>
              </div>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition duration-250">
                <FaCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                <span>Personality Insights</span>
              </div>
              <span className="text-slate-200 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition duration-250">
                <FaCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                <span>Career Recommendations</span>
              </div>
            </div>

            {/* Pricing Tag */}
            <div className="space-y-1">
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider">
                Professional Career Assessment & Guidance
              </p>
              <p className="text-slate-900 font-extrabold text-xl md:text-2xl">
                Starting at <span className="text-blue-600 font-black">₹499</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="#contact"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-300 text-center text-sm md:text-base cursor-pointer"
              >
                Book Assessment
              </a>
              <a
                href="/Sample_Report.pdf"
                download
                className="border border-slate-200 bg-white/50 backdrop-blur-xs hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50/20 hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base cursor-pointer"
              >
                <FaFileDownload className="text-base animate-pulse" />
                <span>Download Sample Report</span>
              </a>
            </div>

            {/* Trust Highlights Pill Bar */}
            <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-3 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0 border border-blue-100/30">
                  <FaShieldAlt className="text-xs" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-600 leading-tight">Scientific & Reliable</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0 border border-blue-100/30">
                  <FaUsers className="text-xs" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-600 leading-tight">For Students & Parents</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0 border border-blue-100/30">
                  <FaFileAlt className="text-xs" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-600 leading-tight">Detailed Career Report</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0 border border-blue-100/30">
                  <FaHeadset className="text-xs" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-600 leading-tight">Expert Guidance Support</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Dark Blue Highlight Bar */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 md:p-8 mt-12 shadow-xl border border-slate-850">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="bg-blue-950 p-3.5 rounded-2xl border border-blue-800 text-blue-400 group-hover:scale-105 group-hover:bg-blue-900 transition duration-300 shrink-0">
                <FaCompass className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Career Clarity</h4>
                <p className="text-slate-400 text-xs mt-1">Make informed decisions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="bg-indigo-950 p-3.5 rounded-2xl border border-indigo-800 text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-900 transition duration-300 shrink-0">
                <FaRoute className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Better Planning</h4>
                <p className="text-slate-400 text-xs mt-1">Choose the right path early.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="bg-emerald-950 p-3.5 rounded-2xl border border-emerald-800 text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-900 transition duration-300 shrink-0">
                <FaKey className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Unlock Potential</h4>
                <p className="text-slate-400 text-xs mt-1">Discover your true strengths.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="bg-amber-950 p-3.5 rounded-2xl border border-amber-400 group-hover:scale-105 group-hover:bg-amber-900 transition duration-300 shrink-0">
                <FaSun className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Bright Future</h4>
                <p className="text-slate-400 text-xs mt-1">Build a successful tomorrow.</p>
              </div>
            </div>

          </div>

          {/* Contact details at bottom of the banner */}
          <div className="border-t border-slate-800 mt-6 pt-6 flex flex-wrap justify-between items-center gap-4 text-sm text-slate-300">
            <div className="text-slate-450 text-xs font-medium">
              Bharat Technologies & Supplies • Career Guidance
            </div>
            <div className="flex flex-wrap gap-6">
              <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-emerald-400 hover:scale-102 transition duration-300">
                <FaPhoneAlt className="text-emerald-500 text-xs" />
                <span className="font-bold">{phone}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-400 hover:scale-102 transition duration-300">
                <FaEnvelope className="text-blue-400 text-xs" />
                <span className="font-bold">{email}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
