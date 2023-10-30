# Especifica a imagem base
FROM node:16

# Define o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copia os arquivos de definição do projeto e instala as dependências
COPY package*.json ./
RUN npm install

# Copia os arquivos de código-fonte do projeto
COPY . .

# Compila os arquivos TypeScript
RUN npm run build

# Comando para executar o aplicativo
CMD [ "npm", "start" ]
