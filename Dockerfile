FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN apt-get update 
RUN apt-get install ffmpeg aria2
RUN npm install -g pm2
CMD ["pm2-runtime", "process.yml"]
