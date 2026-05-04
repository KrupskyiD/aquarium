FROM node:24-alpine as build

#declare build time environment variable
ARG VITE_BACKEND_URL

#SET DEFAULT VALUES FOR ENVIRONMENT VARIABLES
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

#build app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
#serve with nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
