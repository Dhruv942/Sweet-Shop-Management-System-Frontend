import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🍬 Sweet Shop
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight">
              Welcome to Sweet Shop
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-medium leading-relaxed">
              Your One-Stop Destination for Delicious Sweets & Treats
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Shop Information Section */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                About Our Sweet Shop
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🍰
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Fresh Daily</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We prepare all our sweets fresh every day using the finest ingredients and traditional recipes
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🎁
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Wide Variety</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    From traditional Indian sweets to modern fusion desserts, we have something for everyone
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ⭐
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Premium Quality</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Premium quality ingredients and time-tested recipes ensure every bite is a delightful experience
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Our Story</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Sweet Shop has been serving delicious sweets for over two decades. We started with a simple mission: 
                      to bring joy to people's lives through the magic of sweets. Our passion for quality and tradition 
                      has made us a beloved destination for sweet lovers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Authentic traditional recipes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Fresh ingredients daily
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Custom orders welcome
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        Fast and reliable service
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 text-center">
                <p className="text-gray-300 mb-6 text-lg">
                  Ready to satisfy your sweet tooth?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                  >
                    Sign In Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

