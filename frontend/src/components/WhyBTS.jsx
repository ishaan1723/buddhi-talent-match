function WhyBTS() {
  const features = [
    {
      title: "Career Clarity",
      description:
        "Identify your strengths, interests, and career pathways with confidence.",
    },
    {
      title: "Scientific Assessments",
      description:
        "Psychometric tools designed to understand aptitude, personality, and potential.",
    },
    {
      title: "Expert Guidance",
      description:
        "Personalized counselling for stream selection, career planning, and growth.",
    },
    {
      title: "Parent Support",
      description:
        "Helping families make informed educational and career decisions together.",
    },
    {
      title: "Future Readiness",
      description:
        "Build awareness of emerging careers, opportunities, and future skills.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose BTS?
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Helping students make informed academic and career decisions
            through assessment, guidance, mentorship, and career intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm leading-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyBTS;