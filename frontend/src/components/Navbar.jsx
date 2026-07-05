function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">

        {/* Desktop Navbar */}
        <div className="hidden md:flex justify-between items-center">

          {/* Logo Section */}
          <a href="#home" className="flex items-center gap-3">
            <img
              src="/logo.蟍䯑ᨀ退"
              alt="BTS Logo"
              className="h-10 w-auto"
            />

            <div>
              <h3 className="font-semibold text-lg leading-tight">
                Bharat Technologies & Supplies
              </h3>

              <p className="text-xs text-gray-500">
                Career Intelligence & Guidance
              </p>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="flex items-center gap-8 text-gray-700 font-medium">
            <a href="#home" className="hover:text-blue-600 transition">
              Home
            </a>

            <a href="#about" className="hover:text-blue-600 transition">
              About
            </a>

            <a href="#services" className="hover:text-blue-600 transition">
              Services
            </a>

            <a href="#assessment-details" className="hover:text-blue-600 transition">
              Assessment
            </a>

            <a href="#contact" className="hover:text-blue-600 transition">
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition font-medium"
          >
            Book Assessment
          </a>

        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden">

          <div className="flex justify-between items-center">

            <a href="#home" className="flex items-center gap-2">
              <img
                src="/logo.蟍䯑ᨀ退"
                alt="BTS Logo"
                className="h-8 w-auto"
              />
 <div>
              <h3 className="font-semibold text-lg leading-tight">
                Bharat Technologies & Supplies
              </h3>

              <p className="text-xs text-gray-500">
                Career Intelligence & Guidance
              </p>
            </div>
            </a>

            <a
              href="#contact"
              className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              Book
            </a>

          </div>

          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-750 font-medium">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#assessment-details">Assessment</a>
            <a href="#contact">Contact</a>
          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;