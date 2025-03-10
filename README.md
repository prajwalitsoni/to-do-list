1️⃣ Create a package.json File
If you haven't initialized a Node.js project, run:

bash
Copy
Edit
npm init -y
This creates a package.json file.

2️⃣ Add Dependencies
Run:

bash
Copy
Edit
npm install body-parser@^1.20.3 ejs@^3.1.10 express@^4.21.2
This installs the packages and adds them to package.json.

3️⃣ Add a Setup Script (Optional)
If you want a single command to install everything, modify package.json:

json
Copy
Edit
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "Setup for Express app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "setup": "npm install"
  },
  "dependencies": {
    "body-parser": "^1.20.3",
    "ejs": "^3.1.10",
    "express": "^4.21.2"
  }
}
Now, users can run:

bash
Copy
Edit
npm run setup
to install all dependencies.

4️⃣ Add the Setup to a Git Repository
Initialize Git (if not already initialized):
bash
Copy
Edit
git init
Add files to Git:
bash
Copy
Edit
git add package.json package-lock.json
Commit changes:
bash
Copy
Edit
git commit -m "Added setup for dependencies"
Push to GitHub:
bash
Copy
Edit
git remote add origin git@github.com:your-username/your-repo.git
git push -u origin main
5️⃣ Clone and Install on a New System
When someone clones your repo:

bash
Copy
Edit
git clone git@github.com:your-username/your-repo.git
cd your-repo
npm install  # or npm run setup
This will install all necessary dependencies.

Now your package is set up and ready to be installed from Git! 🚀 Let me know if you need further modifications.
