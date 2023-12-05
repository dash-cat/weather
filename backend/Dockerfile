# Dockerfile для PostgreSQL
FROM postgres:latest

# Копируем файлы инициализации базы данных
COPY init.sql /docker-entrypoint-initdb.d/

# Dockerfile для Node.js
FROM node:latest

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Запускаем приложение
CMD [ "node", "./index.js" ]