    # Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate the Prisma Client for the container's platform
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Command to run the application in watch mode
CMD ["npm", "run", "start:dev"]