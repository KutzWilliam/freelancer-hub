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
  const { newOpportunityIds } = req.body;
  if (!newOpportunityIds || !Array.isArray(newOpportunityIds) || newOpportunityIds.length === 0) {
    return res.status(400).json({ error: 'newOpportunityIds é obrigatório e deve ser um array não vazio.' });
  }

  try {
    const { data: opportunities, error: oppsError } = await supabase
      .from('opportunities')
      .select('id, title, description, source_url')
      .in('id', newOpportunityIds);

    if (oppsError) throw oppsError;
    if (!opportunities || opportunities.length === 0) {
      return res.status(200).json({ message: 'Nenhuma oportunidade encontrada para os IDs fornecidos.' });
    }

    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select(`
        term,
        user_id,
        profiles (
          email
        )
      `);

    if (keywordsError) throw keywordsError;
    if (!keywords) throw new Error('Não foi possível buscar as palavras-chave.');

    const notificationsToSend = new Map<string, { email: string; matchedOpportunities: any[] }>();

    for (const opp of opportunities) {
      for (const kw of keywords) {
        const term = kw.term.toLowerCase();
        const title = opp.title.toLowerCase();
        const description = opp.description?.toLowerCase() || '';

        if (title.includes(term) || description.includes(term)) {

          let profileData = null;
          if (Array.isArray(kw.profiles)) {
            profileData = kw.profiles[0];
          } else {
            profileData = kw.profiles;
          }
          const userEmail = profileData?.email;

          if (!userEmail) continue;

          if (!notificationsToSend.has(kw.user_id)) {
            notificationsToSend.set(kw.user_id, { email: userEmail, matchedOpportunities: [] });
          }

          const userNotifications = notificationsToSend.get(kw.user_id)!;
          if (!userNotifications.matchedOpportunities.some(o => o.id === opp.id)) {
            userNotifications.matchedOpportunities.push(opp);
          }
        }
      }
    }

    if (notificationsToSend.size > 0) {
      console.log(`Preparando para enviar ${notificationsToSend.size} e-mails...`);
      const emailPromises = [];
      for (const notification of notificationsToSend.values()) {
        emailPromises.push(
          sendNewOpportunitiesEmail(notification.email, notification.matchedOpportunities)
        );
      }
      await Promise.all(emailPromises);
      console.log('Todos os e-mails foram processados.');
    } else {
      console.log('Nenhuma notificação para enviar nesta rodada.');
    }

    res.status(200).json({ message: 'Processamento de notificações concluído.', notificationsSent: notificationsToSend.size });

  } catch (error: any) {
    console.error('Erro no processamento de notificações:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${port}`);
});