import { Mail, Phone, MapPin, Linkedin, Facebook } from 'lucide-react';
import contactBg from "../assets/ContactUs.avif"; // ✅ Import the background image

// Main App component
export default function App() {
  const companyInfo = {
    name: "Francess Logistic Company",
    address: "FAJC Building, Buhay na Tubig, Imus Cavite, Philippines",
    phone1: "+46 230 2842",
    phone2: "+63 908 881 3881",
    email: "support@francesslogistic.com",
    linkedin: "https://www.linkedin.com/in/francess-logistics-services-opc-4b6122316/",
    facebook: "https://www.facebook.com/profile.php?id=61561795800952",
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 font-sans relative"
      style={{
        backgroundImage: `url(${contactBg})`, // ✅ Use imported image here
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Main content container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            We're here to help you with your logistics needs.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Details Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2">
              Our Information
            </h2>

            {/* Address */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl shadow-inner">
              <MapPin size={24} className="text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-gray-700">Address</h3>
                <p className="text-gray-600">{companyInfo.address}</p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl shadow-inner">
              <Phone size={24} className="text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-gray-700">Phone</h3>
                <a href={`tel:${companyInfo.phone1}`} className="block text-gray-600 hover:text-blue-600 transition-colors">{companyInfo.phone1}</a>
                <a href={`tel:${companyInfo.phone2}`} className="block text-gray-600 hover:text-blue-600 transition-colors">{companyInfo.phone2}</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl shadow-inner">
              <Mail size={24} className="text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-gray-700">Email</h3>
                <a href={`mailto:${companyInfo.email}`} className="block text-gray-600 hover:text-blue-600 transition-colors">{companyInfo.email}</a>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2">
              Connect with Us
            </h2>
            <p className="text-gray-600">
              Follow us on social media to stay updated on our latest news and services.
            </p>

            <div className="flex flex-col space-y-4">
              {/* LinkedIn */}
              <a 
                href={companyInfo.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 p-4 bg-blue-700 text-white rounded-xl shadow-md hover:bg-blue-800 transition-all transform hover:scale-105"
              >
                <Linkedin size={28} />
                <span className="font-medium text-lg">LinkedIn</span>
              </a>

              {/* Facebook */}
              <a 
                href={companyInfo.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 p-4 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition-all transform hover:scale-105"
              >
                <Facebook size={28} />
                <span className="font-medium text-lg">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
