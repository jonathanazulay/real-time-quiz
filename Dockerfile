FROM node:13.8.0

WORKDIR /usr/src/real-time-quiz
ADD package.json ./package.json
ADD package-lock.json ./package-lock.json
RUN npm install
ADD . .
RUN npm run build
EXPOSE 1234
CMD ["node", "./server/main.js"]