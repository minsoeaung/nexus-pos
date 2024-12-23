FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The backend's endpoint is localhost 5000
ENV VITE_ROOT_URL=http://localhost:5000/
RUN npm run build
# At this point build-contents are in /app/dist folder.

FROM nginx:stable-alpine AS production

# Take /app/dist from the step above
COPY --from=build /app/dist /usr/share/nginx/html
# Replace nginx config so that sub-routes work.
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]