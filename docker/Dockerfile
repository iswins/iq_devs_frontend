FROM nginx:alpine

# устанавливаем простой HTTP-сервер для статики
RUN apk add nodejs
RUN apk add npm

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /app


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
