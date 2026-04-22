# 🎓 Online Project Submission Portal

A full-stack web application designed for students to submit projects and faculty to review and grade them.

## 🚀 Features

- **User Authentication**: Secure login and registration for Students and Faculty using JWT and Bcrypt.
- **Student Dashboard**: Submit projects with title, description, and links. View submission status and faculty feedback.
- **Faculty Dashboard**: View all submissions, filter by status, and provide feedback/approval.
- **Responsive Design**: Modern UI built with Vanilla CSS, fully responsive for mobile and desktop.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), Password Hashing

## 📦 Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/project_portal
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Open `http://localhost:5000` in your browser.

## 🌐 Deployment

This project is ready to be deployed on platforms like **Render**, **Railway**, or **Heroku**.
- Ensure you set up a **MongoDB Atlas** cluster for the live database.
- Configure environment variables in your hosting provider's dashboard.

## 📄 License

This project is licensed under the ISC License.
