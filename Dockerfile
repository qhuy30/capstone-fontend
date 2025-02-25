FROM node:lts-alpine
ENV NODE_ENV=production
ENV HOST=0.0.0.0
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --unsafe-perm=true --allow-root --production --silent && mv node_modules ../
COPY . . 
EXPOSE 3000
RUN chown -R node /usr/src
RUN chmod 777 /usr/src
USER node
CMD ["npm", "start"]
