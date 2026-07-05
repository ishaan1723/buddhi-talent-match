function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About BTS</h2>

          <p className="text-gray-600 max-w-3xl mx-auto">
            Bharat Technologies & Supplies (BTS) is an Education and Career
            Development organization focused on helping students make informed
            academic, career, and life decisions. Our mission is to empower
            students, parents, educational institutions, and communities through
            Career Intelligence, Psychometric Assessment, Career Guidance,
            Mentorship, Counselling, and Future Readiness Programs.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Career Intelligence</h3>
            <p className="text-gray-600">
              Scientific assessments and career insights.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Career Guidance</h3>
            <p className="text-gray-600">
              Personalized guidance for academic and career decisions.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Mentorship</h3>
            <p className="text-gray-600">
              Learn from experienced professionals and mentors.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Parent Support</h3>
            <p className="text-gray-600">
              Helping parents support informed career choices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
