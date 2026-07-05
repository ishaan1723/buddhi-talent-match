function Founder() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Meet Our Founder
          </h2>

          <p className="text-gray-600">
            Leadership driving career intelligence and student success.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-10">
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* Founder Image */}
            <img
              src="/kamlesh.jpg"
              alt="Kamlesh Padhiyar"
              className="w-64 h-64 object-cover rounded-2xl shadow-md"
            />

            {/* Founder Content */}
            <div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">
                Kamlesh Padhiyar
              </h3>

              <p className="text-lg font-semibold text-gray-700 mb-6">
                Founder, BTS Education Division
              </p>

              <p className="text-gray-600 leading-8 mb-6">
                Kamlesh Padhiyar is a Social Entrepreneur, Operations Strategist,
                and Education Innovator with over 15 years of leadership
                experience across public service systems, emergency response
                management, education initiatives, and social impact projects.
              </p>

              <p className="text-gray-600 leading-8 mb-6">
                Through BTS Education Division, he is committed to helping
                students, parents, educational institutions, and professionals
                make informed academic and career decisions through assessment,
                guidance, mentorship, counselling, and career development
                programs.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-700">
                    15+ Years
                  </h4>
                  <p className="text-sm text-gray-600">
                    Leadership Experience
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-700">
                    Emergency Response
                  </h4>
                  <p className="text-sm text-gray-600">
                    Systems Management
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-700">
                    Public Service
                  </h4>
                  <p className="text-sm text-gray-600">
                    Management & Operations
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-700">
                    Education & Social Impact
                  </h4>
                  <p className="text-sm text-gray-600">
                    Initiatives & Projects
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Founder;