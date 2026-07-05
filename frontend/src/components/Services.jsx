function Services() {
  const services = [
  {
    title: "Career Clarity Assessment",
    description:
      "A structured psychometric and career intelligence assessment designed to help individuals understand aptitude, interests, personality traits, strengths, learning preferences, and career inclinations."
  },
  {
    title: "Career Guidance & Counselling",
    description:
      "One-to-one guidance sessions for stream selection, course selection, career planning, higher education planning, and professional development."
  },
  {
    title: "Mentorship Programs",
    description:
      "Connecting learners with experienced professionals, industry experts, and mentors for practical career guidance and long-term growth."
  },
  {
    title: "Parent Guidance Programs",
    description:
      "Helping parents understand their child's strengths, support career decisions, reduce confusion, and improve educational planning."
  },
  {
    title: "School & Institutional Solutions",
    description:
      "Career workshops, psychometric assessments, student development programs, and career awareness sessions for schools, colleges, and institutions."
  }
];
   return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4">
                {service.title}
              </h3>

              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Services;