export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
            E-Clean
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Premium Cleaning Solutions for Modern Living
          </p>
          <p className="mt-2 text-lg text-secondary font-medium">
            Part of ELECTRON Group
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-semibold text-primary">E-Commerce</h3>
            <p className="text-gray-600 mt-2">Complete catalog & cart system</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">💳</div>
            <h3 className="text-lg font-semibold text-primary">Payments</h3>
            <p className="text-gray-600 mt-2">Stripe, PayPal, Crypto</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold text-primary">Logistics</h3>
            <p className="text-gray-600 mt-2">Multi-carrier shipping</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-lg font-semibold text-primary">AI Agents</h3>
            <p className="text-gray-600 mt-2">5 intelligent agents</p>
          </div>
        </div>
      </div>
    </main>
  )
}