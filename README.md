# TaB (Track and Be Safe)

## About

TaB is an app that keeps you informed about local events and potential risks. It uses web-scraping and real-time data analysis to provide up-to-the-minute information on events happening around you and future occurrences.

## Key Features

1. Event Tracking (Personal/Group)
2. User-Friendly Design (Mobile Compatible)
3. Danger Assessment System (Notification) and News Components
4. User Customisable Permissions and Groups (Django)


## Future Features

- Interactive Map Interface
- Customisable Alerts
- Comprehensive Event Details
- User Details

## Tech Stack

- Frontend: React, NextUI
- Backend: Django
- Database: PostgreSQL
- Containerization: Docker

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TaB.git
   cd TaB
   ```

2. Build and start the containers:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - Admin panel: [http://localhost:8000/admin](http://localhost:8000/admin)

### Useful Docker Commands

- Start all services: `docker-compose up`
- Start in detached mode: `docker-compose up -d`
- Stop all services: `docker-compose down`
- View logs: `docker-compose logs -fv`
- Rebuild specific service: `docker-compose up -d --build <service-name>`

### Database Migrations

To run database migrations:
```bash
python manage.py migrate
```

### Creating a Superuser

To create an admin superuser:
```bash
python manage.py createsuperuser
```
## Screenshots

<img width="395" alt="image" src="https://github.com/user-attachments/assets/256d9cc8-a35c-4f92-8ab1-e4c97a605773">
<img width="394" alt="image" src="https://github.com/user-attachments/assets/15e10ef5-a9cc-4701-8e51-280503fbb852">
<img width="1001" alt="image" src="https://github.com/user-attachments/assets/600a074c-3b94-4e62-b69e-48184a1a8d56">
<img width="1283" alt="image" src="https://github.com/user-attachments/assets/77507e85-0022-4679-835c-c6776cba319c">


## Resources

- [Django Learning Resources](https://learndjango.com/tutorials)
- [NextUI Documentation](https://nextui.org/docs/components/calendar)
- [Project Slides](https://www.canva.com/design/DAGTauHaS5E/S0zPGviErzsv_1KD9Mkitw/edit?utm_content=DAGTauHaS5E&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
