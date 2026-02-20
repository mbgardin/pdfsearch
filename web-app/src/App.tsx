import { useState } from 'react';
import axios from 'axios';
import { DocumentMagnifyingGlassIcon, ServerIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

function App() {
  const [query, setQuery] = useState('');
  const [numResults, setNumResults] = useState(10);
  const [minPages, setMinPages] = useState(0);
  const [maxPages, setMaxPages] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    setMessage('Searching for PDFs...');

    try {
      const params: any = {
        query,
        num_results: numResults,
        min_pages: minPages,
      };

      if (maxPages) {
        params.max_pages = parseInt(maxPages);
      }

      const resp = await axios.get('/api/search', { params });
      setResults(resp.data.links);
      setMessage(resp.data.message || 'Search complete.');
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'An error occurred during the search.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header section */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-10">
        <div className="p-4 bg-indigo-600/20 rounded-full border border-indigo-500/30 mb-6 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
          <DocumentMagnifyingGlassIcon className="w-12 h-12 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight text-center mb-4">
          PDF Search Engine
        </h1>
        <p className="text-slate-400 text-lg md:text-xl text-center max-w-2xl font-light">
          A powerful tool to find, validate, and filter academic and technical PDF documents across the web.
        </p>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Search Panel */}
        <div className="lg:col-span-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-2xl h-fit sticky top-12">
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label htmlFor="query" className="text-sm font-semibold text-slate-300 uppercase tracking-wider ml-1">Search Keywords</label>
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Harry Potter, Machine Learning..."
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-indigo-500 rounded-2xl px-5 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Min Pages</label>
                <input
                  type="number"
                  min="0"
                  value={minPages}
                  onChange={(e) => setMinPages(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Max Pages</label>
                <input
                  type="number"
                  min="0"
                  value={maxPages}
                  onChange={(e) => setMaxPages(e.target.value)}
                  placeholder="No limit"
                  className="w-full bg-slate-900/50 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Num Results</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={numResults}
                  onChange={(e) => setNumResults(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-sm font-medium text-indigo-400 w-8">{numResults}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <span>Search PDFs</span>
                    <DocumentMagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Status Message */}
          <div className={`p-4 rounded-2xl flex items-center gap-3 transition-opacity duration-500 ${message ? 'opacity-100 bg-slate-800/80 border border-slate-700/50' : 'opacity-0'}`}>
            <ServerIcon className="w-5 h-5 text-indigo-400" />
            <p className="text-slate-300 text-sm font-medium">{message || 'Ready to search.'}</p>
          </div>

          {/* Results List */}
          <div className="flex flex-col gap-4 mt-2">
            {!isLoading && results.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 p-5 rounded-3xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-slate-700 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors shrink-0">
                  <AcademicCapIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-slate-200 font-semibold text-lg truncate mb-1 pr-4">{link.split('/').pop() || 'Document'}</h3>
                  <p className="text-indigo-400/80 text-sm truncate font-mono">
                    {link}
                  </p>
                </div>
                <div className="text-slate-600 group-hover:text-pink-400 transition-colors shrink-0 font-medium text-sm">
                  PDF
                </div>
              </a>
            ))}

            {/* Empty State placeholder */}
            {!isLoading && results.length === 0 && !message.includes('Searching') && query && (
              <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 border border-slate-700/30 rounded-3xl border-dashed">
                <DocumentMagnifyingGlassIcon className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-slate-300 font-medium text-lg">No documents found</h3>
                <p className="text-slate-500 text-sm text-center mt-2 max-w-sm">Try adjusting your keywords or loosening the page count filters to see more results.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
