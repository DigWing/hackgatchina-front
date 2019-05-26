FROM node AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN yarn build

FROM nginx:stable

COPY  --from=build /app/build/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
