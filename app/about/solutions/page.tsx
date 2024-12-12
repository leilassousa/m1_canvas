export default function Solutions() {
  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Solutions</h1>
        
        <div className="grid gap-8">
          {/* Business Strategy */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Business Strategy</h2>
            <p className="text-gray-600">
              Comprehensive business planning and strategy development to help you achieve your goals.
            </p>
          </div>

          {/* Digital Transformation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Digital Transformation</h2>
            <p className="text-gray-600">
              Modern digital solutions to streamline your operations and enhance customer experience.
            </p>
          </div>

          {/* Market Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Market Analysis</h2>
            <p className="text-gray-600">
              In-depth market research and competitor analysis to identify opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}