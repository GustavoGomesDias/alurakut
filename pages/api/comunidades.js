import { SiteClient } from 'datocms-client';
import { TOKEN } from '../../env';

export default async function recebedorDeRequest(request, response) {

  if (request.method === 'POST') {
    const client = new SiteClient(TOKEN);

    const registro = await client.items.create({
      itemType: '973161',
      ...request.body,
    });

    response.json({
      registro: registro,
    });
    return;
  }

  response.status(404).json({
    message: 'Sei de nada.',
  });
}
