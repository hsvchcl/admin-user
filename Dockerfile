FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/remember-project /usr/share/nginx/html