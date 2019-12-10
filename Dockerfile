FROM node:lts-alpine

WORKDIR eierspeck

COPY package*.json ./

RUN npm install

COPY users.json .
ADD src ./src

RUN npm run build

CMD ["npm", "run", "start"]
