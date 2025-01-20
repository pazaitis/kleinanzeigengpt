import { Anthropic } from '@anthropic-ai/sdk';
import { supabaseAdmin } from '../../supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, description, sellerInfo } = req.body;

  try {
    const prompt = `Analysiere diese iPhone-Anzeige auf Kleinanzeigen.de auf potenzielle Warnzeichen, Betrugsversuche oder verdächtige Muster. Antworte auf Deutsch.

Titel: ${title}
Beschreibung: ${description}
Verkäuferinformationen: ${sellerInfo}

Bitte analysiere die folgenden Aspekte und strukturiere deine Antwort entsprechend:

1. Glaubwürdigkeit der Anzeige
- Wie vertrauenswürdig erscheint die Anzeige insgesamt?
- Gibt es Unstimmigkeiten in der Beschreibung?

2. Betrugshinweise
- Typische Betrugsmerkmale vorhanden?
- Verdächtige Formulierungen oder Versprechungen?

3. Preisanalyse
- Ist der Preis realistisch oder verdächtig?
- Gibt es preisbezogene Warnzeichen?

4. Verkäuferprofil
- Bewertung der Verkäuferinformationen
- Auffälligkeiten im Profil?

5. Zusammenfassung & Empfehlung
- Gesamteinschätzung der Sicherheit
- Konkrete Handlungsempfehlung

Formatiere die Analyse übersichtlich mit Zwischenüberschriften und klaren Warnhinweisen, falls verdächtige Muster erkannt werden.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const analysis = message.content[0].text;

    // Get token count from response
    const tokensUsed = message.usage.total_tokens;

    // Update the analysis record with token usage
    await supabaseAdmin
      .from('analyses')
      .update({ 
        tokens_used: tokensUsed,
        maps_calls: 1 // Increment if multiple calls are made
      })
      .eq('id', analysisId);

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error analyzing listing:', error);
    return res.status(500).json({ message: 'Error analyzing listing details' });
  }
} 