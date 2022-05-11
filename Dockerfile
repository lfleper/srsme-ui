FROM nginx:1.21.6-alpine

COPY docker/default-server.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
