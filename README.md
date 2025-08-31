Task Manager
It is a straightforward and efficient task management application designed to help you organize your daily tasks, track your progress, and boost your productivity. Built with Python, this application provides a clean and intuitive interface for managing your to-do lists.

Features
Create, Read, Update, and Delete (CRUD) tasks seamlessly.
Clean and user-friendly web interface.
Persistent storage of tasks using an SQLite database.
Lightweight and easy to set up.

Prerequisites
Before you begin, ensure you have the following installed on your system:
Python 3.8+
pip (Python's package installer)
Git

Installation & Setup
Follow these steps to get your local development environment running.

1. Clone the Repository
git clone [https://github.com/your-new-username/VEXOCORE-task-manager.git](https://github.com/your-new-username/VEXOCORE-task-manager.git)
cd VEXOCORE-task-manager
(Remember to replace your-new-username with your actual GitHub username!)

2. Create and Activate a Virtual Environment
It's highly recommended to use a virtual environment to keep project dependencies isolated.
For macOS/Linux:
python3 -m venv venv
source venv/bin/activate

For Windows:
python -m venv venv
.\venv\Scripts\activate

3. Install Dependencies
Install all the necessary Python packages listed in the requirements.txt file.
pip install -r requirements.txt

Running the Application
Once the setup is complete, you can run the application with a single command:
python app.py

After running the command, you should see output in your terminal indicating that the server is running, usually on http://127.0.0.1:5000.
Usage
Open your web browser and navigate to:
http://127.0.0.1:5000

You can now start adding, viewing, and managing your tasks through the web interface.
