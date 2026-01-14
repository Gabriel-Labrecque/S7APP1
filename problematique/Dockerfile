FROM node:18-slim
WORKDIR /app

RUN chown -R node:node /app
USER node
COPY --chown=node:node . .

EXPOSE 8443
CMD ["node", "server.js"]
