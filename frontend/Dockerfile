FROM node
WORKDIR /app
COPY package*.json ./
RUN yarn install

RUN yarn global add serve

COPY . .
RUN yarn build
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]