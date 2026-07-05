import { useSettings } from "../utils/SettingsContext";

function Footer() {
  const { phone, email, address } = useSettings();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
<div className="flex items-center gap-3 mb-4">
  <img
    src="/logo.蟍䯑ᨀ退"
    alt="BTS Logo"
    className="h-12"
  />
  <div>
    <h3 className="font-bold">
      Bharat Technologies & Supplies
    </h3>
  </div>
</div>
       

        <p className="mb-2">
          Understand Yourself Before Choosing Your Career.
        </p>

        <p>📞 {phone} </p>
        <p>📧 {email}</p>
        <p>📍 {address}</p>

        {/* Footer Credits */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-300">

          <p>
            © 2026 BTS Education Division. All Rights Reserved.
          </p>

          <p className="mt-2">
           This website was developed by the IT Team in consultation with M/s Computer Components.

          </p>

          <p className="mt-2">
           Built using the Buddhi Framework, an in-house methodology created by Consultant Deepak Jain.
          </p>

          <p className="mt-2">
            Team Members: Ishaan Jain & Shlok Kotiyal
          </p>

        </div>

      </div>
      
    </footer>
  );
}

export default Footer;