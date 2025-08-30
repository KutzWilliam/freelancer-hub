import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, PlusCircle } from 'lucide-react';

// Novas props: a lista de keywords e as funções para alterá-la
type KeywordManagerProps = {
  keywords: string[];
  onAddKeyword: (term: string) => Promise<void>;
  onDeleteKeyword: (term: string) => Promise<void>;
};

export const KeywordManager = ({ keywords, onAddKeyword, onDeleteKeyword }: KeywordManagerProps) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddKeyword(newKeyword);
    setNewKeyword(''); // Limpa o input após adicionar
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Adicione ou remova termos para refinar sua busca em tempo real.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Ex: typescript, sênior..."
        />
        <Button type="submit" size="icon" title="Adicionar Palavra-chave">
          <PlusCircle className="w-4 h-4" />
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((kw) => (
            <Badge key={kw} variant="secondary" className="flex items-center gap-2">
              {kw}
              <button onClick={() => onDeleteKeyword(kw)} className="hover:text-destructive" title={`Remover "${kw}"`}>
                <Trash2 className="w-3 h-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma palavra-chave adicionada.</p>
        )}
      </div>
    </div>
  );
};