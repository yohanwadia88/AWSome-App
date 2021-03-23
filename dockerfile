FROM 930252226678.dkr.ecr.eu-west-1.amazonaws.com/node:14
WORKDIR /usr/app
COPY src ./
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
