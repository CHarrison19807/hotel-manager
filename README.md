## Installation

Follow these steps to run this project:

1. **Install Node.js and npm**:

   You can download and install both from the [official Node.js website](https://nodejs.org/).

   Verify the installation by opening a terminal and running the following commands:

   ```bash
   node --version
   npm --version
   ```

   Each command should print the installed version of Node.js and npm, respectively.

2. **Download the repository**:

   Download the zip file from the Git repository.

3. **Navigate to the project directory**:

   Use the `cd` command to navigate to the project directory:

   ```bash
   cd <project_directory>
   ```

   Replace `<project_directory>` with the path to your project directory.

4. **Install the project dependencies**:

   Run the following command to install dependencies.

   ```bash
   npm install
   ```

5. **Configure your database connection**:

   Configure your database connection details in initDB.ts.

6. **Initialize the database**:

   Run the following command to initialize your database.

   ```bash
   npx ts-node --skip-project src/lib/initDB.ts
   ```

7. **Run the dev server**:

   Run the following command to start the development server.

   ```bash
   npm run dev
   ```

   The application should be accessible at your local [port 3000](localhost:3000/).
