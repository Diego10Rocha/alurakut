import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import nookies from 'nookies';
import jwt from 'jsonwebtoken'

function ProfileSidebar(props){
  //console.log(props);
  return(
    <Box as="aside">
      <img src={`https://www.github.com/${props.githubUser}.png`} style={{borderRadius: "8px"}}/>
      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr/>

      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(props){
  let contador = 0;
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">{props.title} ({props.items.length})</h2>
            <ul>
              
              {props.items.map((itemAtual)=>{
                if(contador < 6){
                contador++
                return (
                  
                  <li key={itemAtual.login}>
                    <a href={`https://github.com/${itemAtual.login}.png`}>
                      <img src={`https://github.com/${itemAtual.login}.png`} />
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              }else if(contador == 6){
                contador++;

                return(
                  <div>
                    <hr/>
                    <a className="boxLink" href="#">Ver mais</a>
                  </div>
                )
              }})}
              
            </ul>
          </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {

  const [comunidades, setComunidades] = React.useState([]);

  const user = props.githubUser;

  //const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
    'hrezend', 
    'santos-rj', 
    'aoscarr', 
    'Todomir', 
    'luizholiveira', 
    'emvnuel'
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function(){
    //Pega array de dados do github
    fetch('https://api.github.com/users/Diego10Rocha/followers')
      .then((respostaDoServidor)=>{
        if(respostaDoServidor.ok){
          return respostaDoServidor.json();
        }
        throw new Errror('Aconteceu algum problema :( erro: '+respostaDoServidor.status);
      })
      .then((respostaConvertida)=>{
        setSeguidores(respostaConvertida);
      })
      .catch((erro)=>{
        console.log(erro);
      })

      //API GraphQL
      fetch("https://graphql.datocms.com/", {
        method: 'POST',
        headers: {
          'Authorization': '7e431f553d6e66d9ffd34c52e3c42c',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({"query": `query{
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`})
      })
      .then((response) => response.json()) //Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;

        setComunidades(comunidadesVindasDoDato);

        console.log(comunidadesVindasDoDato);
      })
  }, [])
  return (
    <>
      <AlurakutMenu/>
      <MainGrid>
        {/*<Box style="grid-area: profileArea;">Imagem</Box>*/}

        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={user}/>
        </div>
        
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo
            </h1>
            <OrkutNostalgicIconSet/>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCriaComunidade(e){
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                //console.log('Campo:', dadosDoForm.get('title'));
                //console.log('Campo:', dadosDoForm.get('image'));

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: user,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers:{
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(comunidade),
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                })

            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>

          <ProfileRelationsBox title="Seguidores" items={seguidores}/>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
              <ul>
                {comunidades.map((itemAtual)=>{
                  let contador = 0;
                  if(contador<6){
                    contador++
                    return (
                      <li key={itemAtual.id}>
                        <a href={`/comunidades/${itemAtual.id}`}>
                          <img src={itemAtual.imageUrl} />
                          <span>{itemAtual.title}</span>
                        </a>
                      </li>
                    )
                }else if(contador == 6){
                  contador++;
  
                  return(
                    <div>
                      <hr/>
                      <a className="boxLink" href="#">Ver mais</a>
                    </div>
                  )
                }
                })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da comunidade ({pessoasFavoritas.length})</h2>
            <ul>
              {pessoasFavoritas.map((itemAtual)=>{
                let contador = 0;
                if(contador<6){
                  contador++
                  return (
                    <li key={itemAtual}>
                      <a href={`/users/${itemAtual}`}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                    </li>
                  )
                }else if(contador == 6){
                  contador++;
  
                  return(
                    <div>
                      <hr/>
                      <a className="boxLink" href="#">Ver mais</a>
                    </div>
                  )
                }
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          
        </div>
        
      </MainGrid>
    </>
    )
}

export async  function getServerSideProps(context){
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  //console.log(token)

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token,
    }
  })
  .then((resposta) => resposta.json())
  console.log("Autenticado:", isAuthenticated)

  if(!isAuthenticated){
    alert("Usuário não encontrado!")
    return{
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser,
    },
  }
}