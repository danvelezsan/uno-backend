FROM node:16-alpine
COPY . .
EXPOSE 3001
CMD [ "npm", "start" ]