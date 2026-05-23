# ChurchAPI

## Minimundo
Uma igreja deseja fazer o controle das congregações, principalmente em relação as entradas dos dízimos e ofertas. Os dízimos são controlados por membros TESOUREIROS, esses são responsáveis por armazenar as informações sobre os dízimos e ofertas.  Para cada mês é importante saber quais foram os membros que ofertaram, quando ofertaram e quanto ofertaram. No final do mês deve ser fechado a lista dos membros contribuíntes. Além disso deve ser possível os membros fazerem ofertas especiais, quantas eles quiserem. Deve ser possível também colocar as ofertas comuns arrecadadas no culto, informado o total da oferta e o dia arrecadado.

Dentro disso, deve ser possível também colocar as despesas pagas nas congregações. As congregações são filiais de uma sede, essa possuí todas as informações sobre as congregações, bem como as quantidades de membros, quem são os membros e quem são os dízimistas fieis (aqueles que contribuíram nos últimos 3 meses). A sede é acessada pelo Pastor presidente e pelo Tesoureiro Geral. Das congregações os dirigentes locais possuem também acesso as informações das congregações. Aos Pastor presidente e aos dirigentes são apenas capazes de visualizar, enquanto os tesoureiros são capazes de editar e corrigir possíveis erros.

Os membros são capazes de acessar as informações referentes aos últimos dízimos, se foram entregues ou não, além de acessar a carteira de membro, onde ele pode corrigir informações pessoais e adicionar foto.

O cadastro do membro é feito pelo setor de cadastro na igreja sede, esse faz um precadastro com base nas informações do membro (nome, data de nascimento, documento de identidade) e a partir disso passa um login e uma senha inicial, que pode ser alterada pelo membro, para acesso a plataforma. Deve ser possível recuperar a senha a partir do email que foi cadastrado na igreja sede. O login é com base na matricula criada pela igreja.

## Tópico:
- controle dos membros
- controle dos dízimos dos membros e ofertas especiais
- entrada de ofertas das congregações
- despesas da igreja com base nas congregações
- controle de congregações

## Routes:

## Ambiente local

### Requisitos

- Docker
- Docker Compose

### Subir a stack

1. Criar o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Subir banco e API:

```bash
docker-compose up -d --build
```

3. Aplicar as migrations:

```bash
docker-compose run --rm api npx prisma migrate deploy
```

### Endpoints de apoio

- API: `http://localhost:3333`
- Healthcheck: `http://localhost:3333/health`
- Swagger: `http://localhost:3333/api-docs/`
- Login: `POST http://localhost:3333/session`
- Perfil autenticado: `GET http://localhost:3333/me`

### CORS para frontend local

- A API aceita configuracao de origens via `CORS_ORIGINS`.
- O exemplo padrao libera `http://localhost:3000` e `http://localhost:5173`.
- Para liberar outras origens, ajuste a variavel separando por virgula.

### Observacoes

- O banco principal do projeto agora e `PostgreSQL`.
- As migrations antigas de `SQLite` foram preservadas em `prisma/migrations_sqlite_legacy`.
- A trilha atual de migrations da aplicacao fica em `prisma/migrations`.
- A autenticacao inicial usa `JWT_SECRET` e `JWT_EXPIRES_IN`.
- Nesta etapa, apenas as rotas de credenciais do proprio usuario foram protegidas diretamente por autenticacao.
