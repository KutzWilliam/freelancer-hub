import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

// Componentes
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { KeywordManager } from '../components/KeywordManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

// Ícones
import {
  Search, Bell, Settings, Filter, ExternalLink, Clock, Bookmark,
  TrendingUp, Star, User, LogOut, MapPin, Key
} from "lucide-react";

// --- Tipagens ---
type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  platform: string | null;
  source_url: string;
  created_at: string;
};

type DashboardProps = {
  session: Session;
};

type ViewMode = 'all' | 'saved';

// --- Função Utilitária para Tempo Relativo ---
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `agora`;
  if (minutes < 60) return `há ${minutes}m`;
  if (hours < 24) return `há ${hours}h`;
  if (days === 1) return `ontem`;
  return `há ${days} dias`;
};

// --- Componente do Modal de Detalhes ---
const OpportunityDetailModal = ({ opportunity, onClose }: { opportunity: Opportunity | null, onClose: () => void }) => {
  if (!opportunity) return null;

  return (
    <Dialog open={!!opportunity} onOpenChange={(isOpen: unknown) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{opportunity.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-2">
            {opportunity.platform && <Badge variant="secondary">{opportunity.platform}</Badge>}
            <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-4 h-4" /> {formatRelativeTime(opportunity.created_at)}</div>
            <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-4 h-4" /> Remoto</div>
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-h-[50vh] overflow-y-auto py-4 pr-6">
          <p>{opportunity.description || "Nenhuma descrição detalhada fornecida."}</p>
        </div>
        <DialogFooter>
          <Button>
            <a href={opportunity.source_url} target="_blank" rel="noopener noreferrer">
              Ver Vaga Original
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- Componente Principal do Dashboard ---
const Dashboard = ({ session }: DashboardProps) => {
  const navigate = useNavigate();

  // --- Estados do Componente ---
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<Set<string>>(new Set());
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // --- Busca de Dados e Inscrição em Tempo Real ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [keywordsRes, opportunitiesRes, savedRes] = await Promise.all([
        supabase.from('keywords').select('term').eq('user_id', session.user.id),
        supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
        supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', session.user.id)
      ]);

      if (keywordsRes.data) setKeywords(keywordsRes.data.map(kw => kw.term));
      if (savedRes.data) setSavedOpportunityIds(new Set(savedRes.data.map(item => item.opportunity_id)));
      if (opportunitiesRes.data) setOpportunities(opportunitiesRes.data);
      
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'opportunities' },
        (payload) => {
          const newOpp = payload.new as Opportunity;
          setOpportunities((current) => [newOpp, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.user.id]);

  // --- Funções de Ação ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleFavorite = async (oppId: string) => {
    const isFavorited = savedOpportunityIds.has(oppId);
    const newSavedIds = new Set(savedOpportunityIds);

    if (isFavorited) {
      await supabase.from('saved_opportunities').delete().match({ user_id: session.user.id, opportunity_id: oppId });
      newSavedIds.delete(oppId);
    } else {
      await supabase.from('saved_opportunities').insert({ user_id: session.user.id, opportunity_id: oppId });
      newSavedIds.add(oppId);
    }
    setSavedOpportunityIds(newSavedIds);
  };

  const handleAddKeyword = async (term: string) => {
    if (term.trim() === '' || keywords.includes(term.trim())) return;

    const { data, error } = await supabase
      .from('keywords')
      .insert({ term: term.trim(), user_id: session.user.id })
      .select()
      .single();

    if (error) {
      alert('Erro ao adicionar palavra-chave: ' + error.message);
    } else if (data) {
      setKeywords([...keywords, data.term]);
    }
  };

  const handleDeleteKeyword = async (termToDelete: string) => {
    const { error } = await supabase
      .from('keywords')
      .delete()
      .eq('user_id', session.user.id)
      .eq('term', termToDelete);

    if (error) {
      alert('Erro ao deletar palavra-chave: ' + error.message);
    } else {
      setKeywords(keywords.filter((kw) => kw !== termToDelete));
    }
  };

  // --- Dados Derivados (Filtragem e Cálculos) com useMemo para Performance ---
  const filteredByKeywords = useMemo(() => {
    if (keywords.length === 0) return opportunities;
    return opportunities.filter(opp => 
      keywords.some(kw => 
        opp.title.toLowerCase().includes(kw.toLowerCase()) || 
        opp.description?.toLowerCase().includes(kw.toLowerCase())
      )
    );
  }, [opportunities, keywords]);

  const filteredByViewMode = useMemo(() => {
    if (viewMode === 'saved') {
      return filteredByKeywords.filter(opp => savedOpportunityIds.has(opp.id));
    }
    return filteredByKeywords;
  }, [viewMode, filteredByKeywords, savedOpportunityIds]);

  const finalOpportunities = useMemo(() => {
    if (!searchTerm) return filteredByViewMode;
    return filteredByViewMode.filter(opp => 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, filteredByViewMode]);

  const opportunitiesToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return opportunities.filter(opp => new Date(opp.created_at) >= today).length;
  }, [opportunities]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">FreelancerHub</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" title="Notificações"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" title="Configurações"><Settings className="w-5 h-5" /></Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />Sair
              </Button>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center" title={session.user.email}>
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-1">Seu Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo(a) de volta! Suas oportunidades personalizadas estão aqui.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novas Hoje</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{opportunitiesToday}</div>
                <p className="text-xs text-muted-foreground">Vagas das últimas 24h</p>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer hover:bg-accent/50 transition-all ${viewMode === 'saved' ? 'border-primary shadow-lg' : 'border-transparent'}`}
              onClick={() => setViewMode('saved')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vagas Salvas</CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savedOpportunityIds.size}</div>
                <p className="text-xs text-muted-foreground">Clique para ver seus favoritos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Palavras-chave</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keywords.length}</div>
                <p className="text-xs text-muted-foreground">Termos monitorados</p>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer hover:bg-accent/50 transition-all ${viewMode === 'all' ? 'border-primary shadow-lg' : 'border-transparent'}`}
              onClick={() => setViewMode('all')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feed Principal</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredByKeywords.length}</div>
                <p className="text-xs text-muted-foreground">Total de vagas no seu perfil</p>
              </CardContent>
            </Card>
        </div>

        {viewMode === 'saved' && (
          <div className="flex items-center justify-center mb-6 bg-secondary text-secondary-foreground p-3 rounded-md">
            <p className="text-sm font-medium">Mostrando apenas vagas salvas.</p>
            <Button variant="link" className="ml-2 h-auto p-0" onClick={() => setViewMode('all')}>Limpar filtro</Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative flex-1 mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar nas vagas filtradas..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground py-10">Carregando seu feed...</div>
              ) : finalOpportunities.length === 0 ? (
                <div className="text-center text-muted-foreground py-10 bg-muted rounded-md">
                   <h3 className="font-semibold">Nenhuma oportunidade encontrada.</h3>
                   <p className="text-sm mt-1">Tente ajustar seus filtros ou palavras-chave.</p>
                </div>
              ) : (
                finalOpportunities.map((opp) => (
                  <Card 
                    key={opp.id} 
                    className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => setSelectedOpportunity(opp)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">{opp.title}</h3>
                          <div className="flex items-center gap-2 mt-2 mb-4">
                            {opp.platform && <Badge variant="secondary">{opp.platform}</Badge>}
                          </div>
                          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{opp.description?.substring(0, 180)}...</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5" title="Publicado"><Clock className="w-4 h-4" /> {formatRelativeTime(opp.created_at)}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <Button variant="outline" size="icon" title="Ver vaga original" onClick={(e) => e.stopPropagation()}>
                              <a href={opp.source_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                           </Button>
                           <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleFavorite(opp.id); }} title={savedOpportunityIds.has(opp.id) ? 'Desfavoritar' : 'Favoritar'}>
                              <Star className={`w-5 h-5 transition-all ${savedOpportunityIds.has(opp.id) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`} />
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
             <Card>
               <CardHeader><CardTitle>Gerenciar Palavras-chave</CardTitle></CardHeader>
               <CardContent>
                 <KeywordManager
                    keywords={keywords}
                    onAddKeyword={handleAddKeyword}
                    onDeleteKeyword={handleDeleteKeyword}
                 />
               </CardContent>
             </Card>
          </div>
        </div>
      </main>

      <OpportunityDetailModal 
        opportunity={selectedOpportunity} 
        onClose={() => setSelectedOpportunity(null)} 
      />
    </div>
  );
};

export default Dashboard;