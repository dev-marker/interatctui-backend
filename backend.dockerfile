FROM node:alpine

ARG SEARXNG_API_URL
ENV SEARXNG_API_URL=${SEARXNG_API_URL}

WORKDIR /home/interactui
COPY src /home/interactui/src
COPY tsconfig.json /home/interactui/
COPY .env /home/interactui/
COPY package.json /home/interactui/
COPY package-lock.json /home/interactui/
RUN npm install
RUN npm run build
CMD [ "npm", "start" ]