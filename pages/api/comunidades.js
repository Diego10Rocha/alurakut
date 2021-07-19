import {SiteClient} from 'datocms-client';


export default async function recebedorDeRequests(request, response){

    if(request.method === "POST"){
        const TOKEN = '2aa897a2aa3eb388481c49e3acb595';
        const client = new SiteClient(TOKEN);

        //Validar os dados antes de sair cadastrando
        const registroCriado = await client.items.create({
            itemType: "976599",//ID do model de Comunities criado pelo DATOCMS
            ...request.body,
            //title: "Comunidade de teste",
            //imageUrl: "https://github.com/Diego10Rocha.png",
            //creatorSlug: "Diego10Rocha"
        })

        console.log(registroCriado);

        response.json({
            dados: "Algum dado qualquer",
            registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST temos!',
    })
}