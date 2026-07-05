function AssessmentProcess() {
  const steps = [
    "Submit Enquiry",
    "BTS Team Connects",
    "Assessment Link Shared",
    "Assessment Completed",
    "Career Report Generated",
    "Guidance & Mentorship"
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          Assessment Process
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step, index) => (
            <div
              key={step}
              className="bg-white p-6 rounded-xl shadow-md text-center"
            >
              <div className="text-blue-600 text-2xl font-bold mb-3">
                {index + 1}
              </div>

              <h3 className="font-semibold">
                {step}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default AssessmentProcess;