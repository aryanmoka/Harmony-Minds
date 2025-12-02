import { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { TakeCare } from './pages/TakeCare';
import { Blog } from './pages/Blog';
import { PlaylistAnalysis } from './types';

type Page = 'home' | 'analyze' | 'results' | 'take-care' | 'blog';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [analysisData, setAnalysisData] = useState<PlaylistAnalysis | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleAnalysisComplete = (data: PlaylistAnalysis) => {
    setAnalysisData(data);
  };

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'analyze' && (
        <Analyze
          onNavigate={handleNavigate}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      {currentPage === 'results' && (
        <Results analysis={analysisData} onNavigate={handleNavigate} />
      )}
      {currentPage === 'take-care' && <TakeCare />}
      {currentPage === 'blog' && <Blog />}
    </div>
  );
}

export default App;
