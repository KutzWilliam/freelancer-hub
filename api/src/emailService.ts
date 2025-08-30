import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  source_url: string;
};

export const sendNewOpportunitiesEmail = async (userEmail: string, opportunities: Opportunity[]) => {
  const opportunitiesHtml = opportunities
    .map(opp => `
      <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
      <h3 style="margin: 0 0 8px 0; font-size: 18px;">
          <a 
            href="${opp.source_url}" 
            target="_blank" 
            style="color: #1a73e8; text-decoration: none; font-weight: bold;"
          >
            ${opp.title}
          </a>
        </h3>
        <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.5;">${opp.description?.substring(0, 200) || ''}...</p>
      </div>
    `)
    .join('');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Freelancer Hub <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Encontramos ${opportunities.length} nova(s) vaga(s) para você!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Olá!</h2>
          <p>Seu assistente do Freelancer Hub encontrou novas oportunidades baseadas nas suas palavras-chave:</p>
          <hr>
          ${opportunitiesHtml}
          <p>Boa sorte na sua busca!</p>
          <p style="font-size: 12px; color: #888;">Você recebeu este e-mail porque está monitorando vagas no Freelancer Hub.</p>
        </div>
      `,
    });

    if (error) {
      console.error(`Erro ao enviar e-mail para ${userEmail}:`, error);
      return;
    }

    console.log(`E-mail de resumo enviado com sucesso para ${userEmail}. ID: ${data?.id}`);
  } catch (error) {
    console.error('Ocorreu uma exceção ao enviar o e-mail:', error);
  }
};