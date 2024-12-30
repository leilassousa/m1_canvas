export default function Solutions() {
  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Solutions</h1>
        
        <div className="grid gap-8">
          {/* Business Strategy */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Marketing Canva</h2>
            <p className="text-gray-600">
              Up next.
            </p>
          </div>

          {/* Digital Transformation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Villagers</h2>
            <p className="text-gray-600">
              Coming soon.
            </p>
          </div>

          {/* Market Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Business Canvas</h2>
            <p className="text-gray-600">
              The solidity of a business plan with the flexibility of a canvas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}