# Ecoleta

Ecoleta é um serviço desenvolvido na semana Next Level Week da Rocketseat que consiste em criar um sistema do zero utilizando **NodeJS**, **ReactJS**, **React Native** e base de dados **Sqlite**.
Esse sistema ira ajudar a otimizar a coleta de residuos e ajudar a descobrir pontos de coleta.

# Funções do sistema
  - Na parte web, pode ser criado um ponto de coleta e indicar quais tipos de materias seu estabelecimento coleta
  - Ja no mobile pode-se pesquisar pontos de coleta com base na cidade e estado e filtrando por itens de coleta. Ainda podendo mandar um e-mail ou um whatsapp clicando nos botões referentes.

### Criando Ponto de coleta

Para cria um ponto de coleta vc deve passar os seguintes campos:

* Imagem do estabelecimento (qualquer tipo de imagem).
* Nome da entidae.
* Email da entidade
* Whatsapp da entidade.
* Selecionar um endereço no mapa.
* Selecionar UF e Cidade.
* E selecionar quais intens o estabelecimento coleta.

# EndPoints da API
 A API feita com node e utilizando **express** tem 4 rotas para se fazer requisição:
 
 ### **/points** - Tipo POST: onde se passa seus valores no formato multipart, seus campos são **name** tipo string, **email** tipo string, **whatsapp** tipo string, **latitude** tipo number, **longitude** tipo number, **city** tipo string, **uf** tipo string, **items** tipo string (passar id dos itens seprados por virgula Ex: 1,2,3) e **image** do tipo file.
 
**Exemplo de Response:**
```json
{
  "id": 4,
  "image": "634acc9b7b25-4cdc90ef-91ee-4fb8-8aed-6b77a0c97e30.jpg",
  "name": "Nome do estabelecimento",
  "email": "email@estabelecimento.com",
  "whatsapp": "111111111",
  "latitude": -00.000000,
  "longitude": -00.000000,
  "city": "São Paulo",
  "uf": "SP"
}
```
###  **/points** - GET: onde se passa query params com os seguintes campos, **city**, **uf** e **items** (id dos itens separados por virgula Ex: 1,2)
**Exemplo de Response:**
```json
[
  {
    "id": 1,
    "image": "b90dcaa89019-4cdc90ef-91ee-4fb8-8aed-6b77a0c97e30.jpg",
    "name": "Mercadinho do seu Zé",
    "email": "ze@teste.com",
    "whatsapp": "11951237777",
    "city": "São Paulo",
    "uf": "SP",
    "longitude": -46.44350051879883,
    "latitude": -23.51594810379064,
    "image_url": "http://<SEU IP>:3333/uploads/b90dcaa89019-4cdc90ef-91ee-4fb8-8aed-6b77a0c97e30.jpg"
  }
]
```

 ### **/points/id** - GET: onde se passa via url o id que deseja o retorno, exemplo **http://<SEU IP>:3333/1**

**Exemplo de Response:**

```json
{
  "serializedPoints": {
    "id": 1,
    "image": "b90dcaa89019-4cdc90ef-91ee-4fb8-8aed-6b77a0c97e30.jpg",
    "name": "Mercadinho do seu Zé",
    "email": "ze@teste.com",
    "whatsapp": "11951237777",
    "city": "São Paulo",
    "uf": "SP",
    "longitude": -46.44350051879883,
    "latitude": -23.51594810379064,
    "image_url": "http://192.168.15.15:3333/uploads/b90dcaa89019-4cdc90ef-91ee-4fb8-8aed-6b77a0c97e30.jpg"
  },
  "items": [
    {
      "title": "Pilhas e baterias"
    },
    {
      "title": "Lãpadas"
    },
    {
      "title": "Óleo de cozinha"
    }
  ]
}
```

###  **/items** - GET: retorna todos os itens da base de dados
**Exemplo de Response:**
```json
[
  {
    "id": 1,
    "title": "Lãpadas",
    "image_url": "http://<SEU IP>:3333/uploads/lampadas.svg"
  },
  {
    "id": 2,
    "title": "Pilhas e baterias",
    "image_url": "http://<SEU IP>:3333/uploads/baterias.svg"
  },
  {
    "id": 3,
    "title": "Papéis e Papelão",
    "image_url": "http://<SEU IP>:3333/uploads/papeis-papelao.svg"
  },
  {
    "id": 4,
    "title": "Resíduos Eletrônicos",
    "image_url": "http://<SEU IP>:3333/uploads/eletronicos.svg"
  },
  {
    "id": 5,
    "title": "Resíduos Orgânicos",
    "image_url": "http://<SEU IP>:3333/uploads/organicos.svg"
  },
  {
    "id": 6,
    "title": "Óleo de cozinha",
    "image_url": "http://<SEU IP>:3333/uploads/oleo.svg"
  }
]
```

### Tela web

<image src="https://user-images.githubusercontent.com/49004830/83961665-bf240f80-a86b-11ea-97da-2c05752dd9fd.gif" width="750" heigth="800"/>

### Tela mobile

<image src="https://user-images.githubusercontent.com/49004830/83963139-0ca77900-a87a-11ea-8896-b2e8f8d571dd.gif" />
