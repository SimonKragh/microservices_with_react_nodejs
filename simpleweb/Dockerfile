#Specify base image
FROM node:14-alpine

#Copy content to container
WORKDIR /usr/app
COPY ./ ./ 

#Install dependencies
RUN npm install 


#Start server
CMD ["npm", "start"]
