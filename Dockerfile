FROM php:8.4-fpm-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    nginx \
    git \
    zip \
    unzip \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    mysql-client \
    nodejs \
    npm

# Instalar extensões PHP para Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www

# Copiar arquivos do projeto
COPY . .

# Instalar dependências PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Instalar dependências Node (se usar Vite/Mix)
RUN npm install && npm run build

# Configurar permissões
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Configurar Nginx
RUN echo 'server { \
    listen 80; \
    root /var/www/public; \
    index index.php index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.php?$query_string; \
    } \
    \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
    \
    location ~ /\.(?!well-known).* { \
        deny all; \
    } \
}' > /etc/nginx/http.d/default.conf

EXPOSE 80

# Script de inicialização
RUN echo "#!/bin/sh\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
php artisan storage:link\n\
php-fpm -D\n\
nginx -g 'daemon off;'" > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]
```

### 3. **Criar o `.dockerignore`**

New File → `.dockerignore`
```
.git
.env
.env.*
node_modules
vendor
storage/logs/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
bootstrap/cache/*
tests
.phpunit.result.cache
```

### 4. **Verificar se `.env` está no `.gitignore`**

Abra o arquivo `.gitignore` e confirme que tem essa linha:
```
.env