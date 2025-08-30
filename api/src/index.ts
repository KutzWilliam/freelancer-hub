import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient';
import { sendNewOpportunitiesEmail } from './emailService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API do Freelancer Hub está funcionando!' });
});

app.post('/api/notify', async (req, res) => {
  console.log('================================================');
  console.log('🏁 INÍCIO DO PROCESSAMENTO DE NOTIFICAÇÃO');
  console.log('================================================');

  const { newOpportunityIds } = req.body;
  if (!newOpportunityIds || !Array.isArray(newOpportunityIds) || newOpportunityIds.length === 0) {
    return res.status(400).json({ error: 'Payload inválido: newOpportunityIds é obrigatório.' });
  }
  console.log(`📥 IDs de oportunidades recebidos:`, newOpportunityIds);

  try {
    const { data: opportunities, error: oppsError } = await supabase
      .from('opportunities')
      .select('id, title, description')
      .in('id', newOpportunityIds);
    
    if (oppsError) throw oppsError;
    
    // LOG 1: VERIFICAR AS VAGAS ENCONTRADAS
    console.log('✅ Vagas encontradas no banco de dados:', JSON.stringify(opportunities, null, 2));

    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('term, user_id, profiles ( email )');

    if (keywordsError) throw keywordsError;
    if (!keywords) throw new Error('Não foi possível buscar as palavras-chave.');

    // LOG 2: VERIFICAR AS PALAVRAS-CHAVE ENCONTRADAS
    console.log('✅ Palavras-chave encontradas no banco de dados:', JSON.stringify(keywords, null, 2));

    const notificationsToSend = new Map<string, { email: string; matchedOpportunities: any[] }>();

    for (const opp of opportunities) {
      for (const kw of keywords) {
        
        // --- LOG 3: DENTRO DO LOOP DE COMPARAÇÃO ---
        console.log('\n--- Comparando ---');
        const term = kw.term.toLowerCase();
        const title = opp.title.toLowerCase();
        const description = opp.description?.toLowerCase() || '';
        const userEmail = kw.profiles?.[0]?.email;
        
        console.log(`➡️  Palavra-chave: "${term}" (do Usuário ID: ${kw.user_id})`);
        console.log(`➡️  Título da Vaga: "${title}"`);
        console.log(`   - Match no Título? `, title.includes(term));
        console.log(`   - Match na Descrição? `, description.includes(term));
        console.log(`📧 E-mail do perfil associado: ${userEmail}`);
        
        if ((title.includes(term) || description.includes(term)) && userEmail) {
            console.log('✅✅✅ MATCH ENCONTRADO E E-MAIL VÁLIDO! Adicionando à fila de notificação.');
            if (!notificationsToSend.has(kw.user_id)) {
                notificationsToSend.set(kw.user_id, { email: userEmail, matchedOpportunities: [] });
            }
            const userNotifications = notificationsToSend.get(kw.user_id)!;
            if (!userNotifications.matchedOpportunities.some(o => o.id === opp.id)) {
                userNotifications.matchedOpportunities.push(opp);
            }
        } else {
            console.log('❌ Sem match ou e-mail ausente.');
        }
        console.log('------------------');
      }
    }
    
    if (notificationsToSend.size > 0) {
      // A lógica de envio de e-mail (Resend) continua aqui...
      console.log(`\n📧 Enviando ${notificationsToSend.size} e-mail(s)...`);
      // ...
    } else {
      console.log('\n🤷 Nenhuma notificação para enviar nesta rodada.');
    }

    res.status(200).json({ message: 'Processamento de notificações concluído.', notificationsSent: notificationsToSend.size });

  } catch (error: any) {
    console.error('💥 ERRO CRÍTICO no processamento de notificações:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${port}`);
});