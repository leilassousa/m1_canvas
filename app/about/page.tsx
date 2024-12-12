export default function About() {
  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About SketchMyBiz</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            SketchMyBiz is a leading business solutions provider, dedicated to helping companies transform their ideas into successful realities.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To empower businesses with innovative solutions and strategic guidance, enabling them to achieve their full potential in today's dynamic market.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            To be the trusted partner for businesses worldwide, known for delivering exceptional value and driving sustainable growth through cutting-edge solutions.
          </p>

          <div className="bg-orange-50 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-orange-800 mb-3">Why Choose Us?</h3>
            <ul className="space-y-3 text-orange-700">
              <li>Expert team with diverse industry experience</li>
              <li>Proven track record of successful implementations</li>
              <li>Innovative solutions tailored to your needs</li>
              <li>Commitment to long-term client success</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}