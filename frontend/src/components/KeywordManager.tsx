import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

type Keyword = {
  id: number;
  term: string;
  user_id: string;
};

type KeywordManagerProps = {
  session: Session;
};

const KeywordManager = ({ session }: KeywordManagerProps) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('keywords').select('*');

      if (error) {
        console.error('Erro ao buscar palavras-chave:', error);
      } else if (data) {
        setKeywords(data);
      }
      setLoading(false);
    };

    fetchKeywords();
  }, []);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (newKeyword.trim() === '') return;

    const { data, error } = await supabase
      .from('keywords')
      .insert({ term: newKeyword.trim(), user_id: session.user.id })
      .select() 
      .single(); 

    if (error) {
      alert('Erro ao adicionar palavra-chave: ' + error.message);
    } else if (data) {
      setKeywords([...keywords, data]);
      setNewKeyword('');
    }
  };

  const handleDeleteKeyword = async (keywordId: number) => {
    const { error } = await supabase.from('keywords').delete().eq('id', keywordId);

    if (error) {
      alert('Erro ao deletar palavra-chave: ' + error.message);
    } else {
      setKeywords(keywords.filter((kw) => kw.id !== keywordId));
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Gerenciar Palavras-Chave</h2>

      <form onSubmit={handleAddKeyword} className="flex gap-4 mb-6">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Ex: react, python, sênior..."
          className="flex-grow bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Adicionar
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {keywords.length > 0 ? (
            keywords.map((kw) => (
              <div
                key={kw.id}
                className="flex items-center bg-gray-700 rounded-full px-4 py-1"
              >
                <span className="text-white mr-3">{kw.term}</span>
                <button
                  onClick={() => handleDeleteKeyword(kw.id)}
                  className="text-red-400 hover:text-red-200 font-bold"
                  title="Remover"
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma palavra-chave adicionada ainda.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordManager;