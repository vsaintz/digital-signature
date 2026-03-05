<div align="center">
<img src="https://res.cloudinary.com/defh2c1db/image/upload/v1772649975/fa04b67bc98b6b808f72898f11abe969_zcbisj.jpg" alt="Digital Signature" width="300" />

<div id="user-content-toc">
  <ul align="center" style="list-style: none;">
    <summary>
      <h1>Digital Signature</h1>
    </summary>
  </ul>
</div>

> A digital seal for those bits of information that need to stay exactly as you left them, no matter how many hands they pass through. It is a persistent way to prove your records are true and look back at their entire history whenever you need to.

<br>

![Stars](https://img.shields.io/github/stars/vsaintz/digital-signature?style=for-the-badge&labelColor=282A36&color=BD93F9)&nbsp;&nbsp;&nbsp;
![Issues](https://img.shields.io/github/issues/vsaintz/digital-signature?style=for-the-badge&labelColor=282A36&color=FF79C6)&nbsp;&nbsp;&nbsp;
![Last Commit](https://img.shields.io/github/last-commit/vsaintz/digital-signature?style=for-the-badge&labelColor=282A36&color=50FA7B)

![Python](https://img.shields.io/badge/Python-3.12-black?style=flat-square&labelColor=ECEFF4&color=5E81AC)&nbsp;
![Django](https://img.shields.io/badge/Django-6.0-black?style=flat-square&labelColor=ECEFF4&color=81A1C1)&nbsp;
![Angular](https://img.shields.io/badge/Angular-21-black?style=flat-square&labelColor=ECEFF4&color=88C0D0)
</div>

<br>

This software is for those moments when you need to be absolutely sure about the integrity of your information. At its core, it provides a way to take your data and apply a permanent digital seal to it. This ensures that whatever was recorded at one point in time remains exactly the same later on, without any quiet changes or bit rot creeping in.

The focus is on creating a verifiable record of who signed a piece of data and exactly when they did it. By normalizing the information before the signature is applied, the system ensures the digital seal is based on the actual meaning of the content. This allows it to detect even the smallest unauthorized edit with total precision.

### Key Features

* **Permanent digital sealing:** Apply a signature that locks the content exactly as it exists in the moment.
* **Content normalization:** Ensures signatures stay valid based on the data's meaning, not just the file format.
* **Persistent audit logs:** A continuous, automated record of every update and shared action.
* **Verifiable timestamps:** Proof of exactly when information was recorded or modified.

<br>

### Prerequisites
To get everything running locally, you’ll need a few tools installed on your machine. We’ve tried to keep the setup as straightforward as possible by using Docker for the heavy lifting on the database side.
- Docker desktop: We use this to handle the PostgreSQL database. It saves you the trouble of having to install or configure a database server manually on your system.

- Python: You’ll need this for the django backend. It handles all the API logic, the JWT authentication, and the core data processing.

- Node.js: This is required for the angular frontend. You’ll use it to manage your packages and run the development server.

<br>

### Setting up the Backend
1. Navigate into the `django/` directory and create your environment file. 

```Bash
cd django
cp .env.example .env
```

2. You’ll need a unique secret key for your environment. You can generate a secure one with this command and then paste it into the SECRET_KEY field in your new .env file:
```Bash
python -c "import secrets; chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'; print(''.join(secrets.choice(chars) for i in range(50)))"
```

3. Once you’ve filled in the rest of your .env values, make sure Docker is running and start the database container from the project root:
```Bash
docker compose --env-file ./django/.env up -d
```

4. Finally, install the Python dependencies and prepare the database:
```Bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
> You only need to run migrations the first time you set things up or when the data models change.

<br>

### Setting up the Frontend
The frontend is an angular application that talks to the django API. To get the interface up and running:

```Bash
yarn install
ng serve
```

### Managing the Database
Since the database runs in a container, you can stop it or reset it whenever you need to:

- Stop the container `docker compose down`
- Full reset (wipes all data) `docker compose down -v`

<br>

### Note on Contributions
> We try to keep the main branch as stable as possible. If you’re working on something even a small fix for a typo, please create a new branch for your changes rather than pushing directly to main.

*Where things live*

The project is organized so that every piece of logic has a predictable home. If you're adding a new feature, here is the general layout:

- app/auth/: Everything related to signing in and out.

- app/guards/: Logic that controls who can see which routes.

- app/services/: The "brain" of the frontend; this is where we fetch data and handle business logic.

- app/interceptors/: Middleware for handling HTTP requests and responses.

- app/dashboard/ & app/landing/: The main views for the authenticated and public areas of the site.

- app/shared/: Global components that are used in multiple places. We try to keep this tidy and only use it for things that are truly universal.

To keep the code clean, I’ve set up path aliases like @auth, @services, and @shared. You can check `tsconfig.json` to see the full list, which helps avoid those long, messy ../../ import paths.
