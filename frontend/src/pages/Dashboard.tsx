import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import KeywordManager from '../components/KeywordManager';
import type { Session } from '@supabase/supabase-js';

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  platform: string | null;
  source_url: string;
};

type DashboardProps = {
  session: Session;
};

const Dashboard = ({ session }: DashboardProps) => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: savedData, error: savedError } = await supabase
        .from('saved_opportunities')
        .select('opportunity_id');

      if (savedError) {
        console.error('Erro ao buscar favoritos:', savedError);
      } else if (savedData) {
        const savedIds = new Set(savedData.map(item => item.opportunity_id));
        setSavedOpportunityIds(savedIds);
      }

      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('term');

      if (keywordsError) {
        console.error('Erro ao buscar palavras-chave:', keywordsError);
        setLoading(false);
        return;
      }

      const userKeywords = keywordsData?.map(kw => kw.term) || [];

      let query = supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterActive && userKeywords.length > 0) {
        const filterString = userKeywords.map(kw => `title.ilike.%${kw}%,description.ilike.%${kw}%`).join(',');
        query = query.or(filterString);
      }

      const { data: opportunitiesData, error: opportunitiesError } = await query;

      if (opportunitiesError) {
        console.error('Erro ao buscar oportunidades:', opportunitiesError);
      } else if (opportunitiesData) {
        setOpportunities(opportunitiesData);
      }

      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'opportunities' },
        (payload) => {
          console.log('Nova oportunidade recebida!', payload);
          setOpportunities((current) => [payload.new as Opportunity, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterActive]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Feed de Oportunidades</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Sair
          </button>
        </div>

        <div className="flex items-center justify-end mb-4">
          <label className="mr-3 text-sm font-medium text-gray-300">
            Filtrar por palavras-chave
          </label>
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${filterActive ? 'bg-cyan-500' : 'bg-gray-600'}`}
            role="switch"
            aria-checked={filterActive}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${filterActive ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <KeywordManager session={session} />

        {loading ? (
          <p className="text-center text-gray-400">Carregando vagas...</p>
        ) : opportunities.length === 0 ? (
          <p className="text-center text-gray-400">Nenhuma oportunidade encontrada com os filtros atuais.</p>
        ) : (
          <div className="grid gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                session={session}
                isInitiallyFavorited={savedOpportunityIds.has(opp.id)}
                {...opp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;