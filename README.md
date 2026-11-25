
# QuickNotes System Design

## 1. Project Description

QuickNotes is a simple online note-taking application. It allows users to load, create, and delete notes using API requests.

This project demonstrates important web development and system design concepts, including REST APIs, HTTP methods, database design, scalability, and system architecture.

## 2. Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- JSONPlaceholder API
- PostgreSQL (database design)

## 3. Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## 4. How to Run the Application

1. Download or clone this repository from GitHub.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension.
4. Click the Load Notes button to retrieve notes from the API.
5. Enter a title and body to create a note.
6. Use the Delete button to remove a note from the displayed list.

The application uses JSONPlaceholder as a practice API. Created and deleted notes are simulated and are not permanently stored on the server.

## 5. Project Documentation

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## 6. What I Learned

Through this project, I learned:

1. How to use GET, POST, and DELETE HTTP methods to communicate with an API.
2. How to handle asynchronous JavaScript requests using async and await.
3. How to handle API errors and display loading and success messages.
4. How to design relational database tables using primary keys and foreign keys.
5. How to use SQL queries and JOIN operations to retrieve related data.
6. How system components such as load balancers, caches, and read replicas improve scalability.
7. How to organize a software project using GitHub repositories and meaningful commits.

## 7. Conclusion

This project helped me understand how frontend applications communicate with APIs and how system design principles support reliable and scalable applications.
