# CRM Programming School

This full-stack project facilitates the management of student applications and inquiries.

- **Backend:** Built using Node.js, Express, and MongoDB (with Mongoose).
- **Frontend:** Developed with React.

## Installation and Setup

### Prerequisites

Ensure you have Docker and Docker Compose installed on your system:
- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### Steps to Install and Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hryhoriistruk/CRM-Programming-School1.git
   ```

2. **Install dependencies:**  
   Navigate to the backend and frontend directories and run the following commands:
    - Backend:
      ```bash
      cd backend
      npm install
      ```
    - Frontend:
      ```bash
      cd ..
      cd frontend
      npm install
      ```

3. **Create a `.env` file:**  
   In the root directory, create a `.env` file based on the `.env.example` file provided. Fill in the required variables with your configuration or contact the project owner for assistance.

4. **Configure the Docker Compose file:**  
   In the `docker-compose.yml` file, update the `ports` field for the app container by replacing `<PORT>` with the port number specified in your `.env` file:
   ```yaml
   ports: "8888:Your PORT"
   ```

5. **Build and launch the application:**  
   Run the following command to build and start the project:
   ```bash
   docker-compose up --build
   ```

6. **Access the application:**  
   Once the build is complete, the application will be available at:
   ```bash
   http://localhost:80
   ```

## Usage

- **API Documentation:**  
  Access Swagger at [http://localhost:80/api/docs/](http://localhost:80/api/docs/).
- **Postman Collection:**  
  Import the `CRM Programming School.postman_collection.json` file (located in the root directory) into your Postman application to explore and test all available endpoints.
