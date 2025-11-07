# Открыть в браузере
http://localhost:3000/


### Запуск приложения

#### Запуск локального сервера
```bash
npm run dev
```

#### Соберите Docker-образ
```bash
docker build -t sports_city_fronted .
```

#### Запустите Docker-контейнер
```bash
docker run -p 3000:3000 sports_city_fronted
```

#### Собрать контейнер API и запустить
```bash
docker-compose --env-file .env up --build
```