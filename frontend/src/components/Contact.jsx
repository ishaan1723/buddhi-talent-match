import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    studentName: "",
    mobileNumber: "",
    email: "",
    class: "",
    school: "",
    city: "",
    requirement: "Career Counselling",
    language: "English",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Enquiry submitted successfully!");

        setFormData({
          studentName: "",
          mobileNumber: "",
          email: "",
          class: "",
          school: "",
          city: "",
          requirement: "Career Counselling",
          language: "English",
        });
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit enquiry.");
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Book Assessment
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Fill in your details and our team will contact you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <input
            type="text"
            name="class"
            placeholder="Class / Standard"
            value={formData.class}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <input
            type="text"
            name="school"
            placeholder="School / College Name"
            value={formData.school}
            onChange={handleChange}
            className="border p-4 rounded-lg"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <select
            name="requirement"
            value={formData.requirement}
            onChange={handleChange}
            className="border p-4 rounded-lg"
          >
            <option>Career Counselling</option>
            <option>Stream Selection</option>
            <option>Career Selection</option>
            <option>Mentorship</option>
            <option>Institutional Enquiry</option>
          </select>

          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="border p-4 rounded-lg"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg md:col-span-2 transition"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>

          {message && (
            <p className="md:col-span-2 text-center font-medium">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;