import React from 'react'

const Services = () => {
  return (
    <div>
          <div
            className="w-full h-screen bg-cover bg-center relative"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center px-6">
              <div className="text-white max-w-3xl text-center">
                <h1 className="text-4xl font-bold mb-4">Services</h1>
              </div>
            </div>
          </div>
    </div>
  )
}

export default Services
