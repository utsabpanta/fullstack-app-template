# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy the entire monorepo (frontend and backend)
COPY . .

# Install root dependencies (including workspaces)
RUN npm install

# Build the frontend
# RUN npm run build --workspace=frontend

# Expose ports for both frontend and backend
EXPOSE 4000 5001

# Start both frontend and backend servers
CMD ["sh", "-c", "npm run start --workspace=backend & npm run start --workspace=frontend"]
