FROM node:18-slim
WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install --only=production
COPY --chown=node:node . .

EXPOSE 8443
CMD ["node", "server.js"]