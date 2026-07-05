import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import WhyBTS from "./components/WhyBTS";
import PsychometricAssessment from "./components/PsychometricAssessment";
import AssessmentProcess from "./components/AssessmentProcess";
import CTA from "./components/CTA";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import WhatsAppButton from "./components/WhatsAppButton";
import Stats from "./components/Stats";
import Founder from "./components/Founder";
import WhoWeHelp from "./components/WhoWeHelp";
import Problems from "./components/Problems";
import { SettingsProvider } from "./utils/SettingsContext";

function App() {
  return (
    <SettingsProvider>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Founder />
      <WhyBTS />
      <PsychometricAssessment />
      
<WhoWeHelp />
<Problems />
      <Services />
      <AssessmentProcess />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
      <WhatsAppButton />
    </SettingsProvider>
  );
}

export default App;
