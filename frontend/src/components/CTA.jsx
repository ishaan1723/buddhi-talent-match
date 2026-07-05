function CTA() {
  return (
    <section className="py-24 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Discover Your Ideal Career Path?
        </h2>

        <p className="mb-8 text-lg">
          Get personalized insights through our Career Clarity Assessment.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="#contact"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Book Assessment
          </a>

          <a
            href="/Sample_Report.pdf"
            download
            className="border border-white px-6 py-3 rounded-lg font-semibold"
          >
            Download Sample Report
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
