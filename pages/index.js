import React from 'react';

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

export default function Home() {
  const [comunidades, setComunidades] = React.useState([{
    id: '1',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  }]);

  const githubUser = 'GustavoGomesDias';
  const favPeoples = [
    'juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho'
  ];

  const [seguidores, setSeguidores] = React.useState([]);
  
  React.useEffect(() => {
    fetch('https://api.github.com/users/GustavoGomesDias/followers')
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      setSeguidores(responseJson);
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
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              };

              const comunidadesAtualizadas = [
                ...comunidades,
                comunidade
              ]

              setComunidades(comunidadesAtualizadas);
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
                    <a href={`/users/${item.title}`}>
                      <img src={item.image} />
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
