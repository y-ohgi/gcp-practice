FROM php:7.2-fpm-alpine

ARG UID=991
ARG UNAME=www
ARG GID=991
ARG GNAME=www

ENV WORKDIR=/var/www/html

WORKDIR /var/www/html

RUN set -x \
    && apk add --no-cache git php7-zlib zlib-dev autoconf gcc alpine-sdk \
    && docker-php-ext-install zip \
    && pecl install grpc protobuf\
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN set -x \
    && echo "extension=grpc.so" >> /usr/local/etc/php/conf.d/grpc.ini \
    && echo "extension=protobuf.so" >> /usr/local/etc/php/conf.d/protobuf.ini

COPY . .

RUN set -x \
    && composer install \
    && addgroup ${GNAME} -g ${GID} \
    && adduser -D -G ${GNAME} -u ${UID} ${UNAME} \
    && chown -R ${UNAME}:${GNAME} /var/www/html \
    && rm -rf /tmp/* /var/cache/apk/*

USER www
