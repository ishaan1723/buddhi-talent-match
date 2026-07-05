function WhoWeHelp() {
  const groups = [
    "Std 8–10 Students",
    "Std 11–12 Students",
    "College Students",
    "Graduates",
    "MBA Aspirants",
    "Working Professionals",
    "Schools & Institutions",
  ];

  return (
    <section className="py-16 bg-white">
  <div className="max-w-5xl mx-auto px-6 text-center">

    <h2 className="text-4xl font-bold mb-4">
      Who We Help
    </h2>

    <p className="text-gray-600 mb-10">
      Personalized career guidance for students, graduates, professionals and institutions.
    </p>

    <div className="flex flex-wrap justify-center gap-4">
      {[
        "Std 8–10 Students",
        "Std 11–12 Students",
        "College Students",
        "Graduates",
        "MBA Aspirants",
        "Working Professionals",
        "Schools & Institutions"
      ].map((item) => (
        <div
          key={item}
          className="bg-blue-50 text-blue-700 px-6 py-3 rounded-full font-medium"
        >
          {item}
        </div>
      ))}
    </div>

  </div>
</section>
  );
}

export default WhoWeHelp;