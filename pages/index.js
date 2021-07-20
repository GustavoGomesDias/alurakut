import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);

  const githubUser = props.githubUser;
  const favPeoples = [
    'juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho'
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        setSeguidores(responseJson);
      });

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '63d231b5dd76d112d228d6bc031d44',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
        allCommunities {
          title,
          id,
          imageUrl,
          creatorSlug
        }
      }` })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const dataCommunity = responseJson.data.allCommunities;
        setComunidades(dataCommunity);
      });
  }, []); // <== O array diz quantas vezes executar.

  function ProfileRelationsBox(props) {
    return (
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {props.title} ({props.items.length || 0})
        </h2>
        <ul>
          {/* {seguidores.map((item) => {
            return (
              <li key={item.id}>
                <a href={`https://github.com/${item.login}.png`}>
                  <img src={item.image} />
                  <span>{item.title}</span>
                </a>
              </li>
            )
          })} */}
        </ul>
      </ProfileRelationsBoxWrapper>
    );
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(event) {
              event.preventDefault();
              const dadosDoForm = new FormData(event.target);


              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser,
              };

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade),
              }).then(async (response) => {
                const dados = await response.json();
                console.log(dados.registro);

                const community = dados.registro;

                const comunidadesAtualizadas = [
                  ...comunidades,
                  community,
                ]

                setComunidades(comunidadesAtualizadas);
              }).catch((err) => console.log(err));
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
                  placeholder="Coloque uma URL pra usar de capa"
                  name="image"
                  aria-label="Coloque uma URL pra usar de capa"
                />
              </div>

              <button>
                Criar Comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox
            title="Seguidores"
            items={seguidores}
          />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Seguidores ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/communities/${item.id}`}>
                      <img src={item.imageUrl} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({favPeoples.length})
            </h2>
            <ul>
              {favPeoples.map((people) => {
                return (
                  <li key={people}>
                    <a href={`/users/${people}`}>
                      <img src={`https://github.com/${people}.png`} />
                      <span>{people}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  const token = cookies.USER_TOKEN;


  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token,
    }
  }).then((response) => response.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser,
    },
  };
}
