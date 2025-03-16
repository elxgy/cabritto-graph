import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APITreeData } from '../types';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const apiResponse = location.state?.apiResponse;
  const apiFormat = location.state?.apiFormat as APITreeData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-12">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Tree Structure</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-12 space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">API Format:</h2>
            <pre className="text-lg font-mono whitespace-pre-wrap">
              {JSON.stringify(apiFormat, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">API Response:</h2>
            <pre className="text-lg font-mono whitespace-pre-wrap">
              {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response available'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;