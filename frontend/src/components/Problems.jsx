function Problems() {
  const problems = [
    "Confused about stream selection?",
    "Unsure about future career?",
    "Parents giving conflicting advice?",
    "Not sure if your chosen field fits your strengths?",
    "Need career direction?",
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Common Problems We Solve
          </h2>

          <p className="text-gray-600">
            Helping students and parents make confident career decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <div
              key={problem}
              className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4"
            >
              <span className="text-green-600 text-2xl">
                ✓
              </span>

              <p className="font-medium">
                {problem}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Problems;