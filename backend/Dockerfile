FROM node
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
COPY .env ./
EXPOSE 3000
CMD ["yarn" , "d"]