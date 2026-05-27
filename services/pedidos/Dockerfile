FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências (força instalação)
RUN npm install --omit=dev

# Copia código fonte
COPY src ./src

EXPOSE 3001
CMD ["npm", "start"]
