import { Activity, ArrowLeft, ChevronDown, GitFork, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const apiResponse = location.state?.apiResponse;
  const [imageUrl, setImageUrl] = useState<string>('');

  const [openSection, setOpenSection] = useState<string | null>('traversal');

  useEffect(() => {
    if (apiResponse?.data.image) {
      const filename = apiResponse.data.image.split('\\').pop();
      setImageUrl(`http://localhost:5000/static/images/${filename}`);
    }
  }, [apiResponse]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const Accordion = ({ title, id, icon, children }: {
    title: string;
    id: string;
    icon: React.ReactNode;
    children: React.ReactNode
  }) => (
    <div className="border rounded-lg overflow-hidden mb-4 hover:border-blue-500 transition-colors">
      <button
        className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-blue-50 transition-colors"
        onClick={() => toggleSection(id)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openSection === id ? 'transform rotate-180' : ''
            }`}
        />
      </button>
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${openSection === id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 py-4 bg-gray-50 border-t">
          {children}
        </div>
      </div>
    </div>
  );

  const TraversalPath = ({ title, data, color }: {
    title: string;
    data: number[];
    color: string;
  }) => (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {data?.map((num: number, idx: number) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded font-medium ${color}`}
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  );

  if (!apiResponse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No tree data available</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
              Retorne para o construtor de árvores
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Dados sobre a árvore</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-blue-500" />
              Visualize sua árvore
            </h2>
            <div className="h-[600px] bg-gray-50 rounded-lg flex items-center justify-center p-8 border-2 border-dashed border-gray-200">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Tree visualization"
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
          </div>

          <Accordion
            title="Caminhos"
            id="traversal"
            icon={<GitFork className="w-5 h-5 text-blue-500" />}
          >
            <div className="space-y-6">
              <TraversalPath
                title="Camino Pré-Ordem"
                data={apiResponse.data.pre_order}
                color="bg-blue-100 text-blue-800"
              />
              {apiResponse.data.in_order && (
                <TraversalPath
                  title="Caminho Em-Ordem"
                  data={apiResponse.data.in_order}
                  color="bg-green-100 text-green-800"
                />
              )}
              <TraversalPath
                title="Caminho Pós-Ordem"
                data={apiResponse.data.post_order}
                color="bg-purple-100 text-purple-800"
              />
            </div>
          </Accordion>

          <Accordion
            title="Propriedades da Árvore"
            id="properties"
            icon={<Activity className="w-5 h-5 text-blue-500" />}
          >
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-medium text-gray-700 mb-4">Tree Characteristics</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Altura:</span>
                    <span className="font-medium text-gray-900">{apiResponse.data.height.split('é')[1].trim()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Classificação:</span>
                    <span className="font-medium text-gray-900">{apiResponse.data.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Estrutura:</span>
                    <span className="font-medium text-gray-900">
                      {apiResponse.data.tree_type.split('é')[1].trim()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;