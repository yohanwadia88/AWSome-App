FROM node:14
WORKDIR /usr/app
COPY src ./
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
