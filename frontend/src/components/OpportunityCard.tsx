import { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

type OpportunityCardProps = {
  id: string;
  title: string;
  description: string | null;
  platform: string | null;
  source_url: string;
  session: Session;
  isInitiallyFavorited: boolean;
};

const OpportunityCard = ({ id, title, description, platform, source_url, session, isInitiallyFavorited }: OpportunityCardProps) => {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const truncateDescription = (text: string, length: number) => {
    if (!text) return 'Sem descrição.';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const handleFavoriteToggle = async () => {
    setIsLoading(true);

    if (isFavorited) {
      const { error } = await supabase
        .from('saved_opportunities')
        .delete()
        .match({ user_id: session.user.id, opportunity_id: id });

      if (error) console.error('Erro ao desfavoritar:', error);
      else setIsFavorited(false);

    } else {
      const { error } = await supabase
        .from('saved_opportunities')
        .insert({ user_id: session.user.id, opportunity_id: id });

      if (error) console.error('Erro ao favoritar:', error);
      else setIsFavorited(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-white pr-4">{title}</h2>
        <div className="flex-shrink-0 flex items-center gap-4">
          {platform && (
            <span className="bg-cyan-800 text-cyan-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              {platform}
            </span>
          )}
          <button onClick={handleFavoriteToggle} disabled={isLoading} className="text-2xl text-gray-400 disabled:opacity-50">
            {isFavorited ? <span className="text-yellow-400">★</span> : <span>☆</span>}
          </button>
        </div>
      </div>
      <p className="text-gray-400 mb-4">
        {truncateDescription(description || '', 150)}
      </p>
      <a
        href={source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Ver Vaga Original
      </a>
    </div>
  );
};

export default OpportunityCard;