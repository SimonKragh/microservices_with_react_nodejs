#Specify base image
FROM node:14-alpine

#Copy content to container
WORKDIR /usr/app

#Install dependencies
COPY ./package.json ./ 
RUN npm install 
COPY ./ ./ 


#Start server
CMD ["npm", "start"]
