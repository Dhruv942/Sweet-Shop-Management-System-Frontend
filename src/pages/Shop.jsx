import React from "react";

// Dummy sweets data
const dummySweets = [
  {
    id: 1,
    name: "Gulab Jamun",
    category: "Traditional",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Rasgulla",
    category: "Traditional",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Kaju Katli",
    category: "Dry Fruits",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Jalebi",
    category: "Traditional",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1606312619070-d48b4bc98b14?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Ladoo",
    category: "Traditional",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Barfi",
    category: "Milk",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Halwa",
    category: "Traditional",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Peda",
    category: "Milk",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1606312619070-d48b4bc98b14?w=400&h=300&fit=crop",
  },
];

function Shop() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to Shop
          </h1>
          <p className="text-xl text-gray-300">
            Explore our delicious collection of sweets
          </p>
        </div>

        {/* Sweets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummySweets.map((sweet) => (
            <div
              key={sweet.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-purple-500/50"
            >
              {/* Image */}
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=" + sweet.name;
                  }}
                />
                <div className="absolute top-2 right-2 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                  {sweet.category}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{sweet.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Category:</span>
                  <span className="text-purple-300 font-semibold">
                    {sweet.category}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-gray-300 text-sm">Price:</span>
                  <span className="text-2xl font-bold text-pink-400">
                    ₹{sweet.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
