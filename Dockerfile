FROM nginx
LABEL maintainer="Ihr Name <you@your.domain>"
COPY nginx/default.conf /etc/nginx/conf.d
COPY dist/books /usr/share/nginx/html
