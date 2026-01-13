# Full-Stack-E-Commerce-MERN-APP
Full Stack E-Commerce MERN APP

![Alt text](Full%20Stack%20E-Commerce%20MERN%20App.png?raw=true "Title")

Backend .env file 

MONGODB_URI = 
TOKEN_SECRET_KEY = 
FRONTEND_URL

Frontend .env file

REACT_APP_CLOUD_NAME_CLOUDINARY = 

Image : https://drive.google.com/drive/folders/1KmY74OYniEodtOVAjNGJv4628HghRbcQ?usp=sharing

Full Video available on youtube : Dynamic Coding with Amit

## Local dev notes (added)
- Run backend seed to create an admin user and sample products:
  - cd backend && npm run seed
  - Admin credentials: **admin@example.com / Admin123!**
- CORS & cookies: in development the server is configured to allow `FRONTEND_URL` from backend `.env`. If you see `Access-Control-Allow-Origin: *` in the browser while `credentials: 'include'` is used, try:
  - Test in an incognito window or disable browser extensions (some extensions modify headers)
  - Check backend console logs (the server logs incoming origins to help debug)
  - Ensure `FRONTEND_URL` in `backend/.env` matches the address your front-end uses (e.g., `http://localhost:3000`)


