
# QuickNotes System Architecture

## 1. Introduction

QuickNotes is an online note-taking application that allows users to create, view, update, delete, and organize their notes. The system is designed to support one million registered users while remaining reliable, secure, and scalable.

## 2. Functional Requirements

1. Users can register and log in securely.
2. Users can create new notes.
3. Users can view their notes.
4. Users can update existing notes.
5. Users can delete notes.
6. Users can organize notes using tags.
7. Users can search for notes by title or content.

## 3. Non-Functional Requirements

1. **Availability:** The application should remain accessible with minimal downtime.
2. **Performance:** Common requests should respond quickly.
3. **Scalability:** The system should support increasing numbers of users.
4. **Security:** User accounts and notes must be protected.
5. **Reliability:** Data should not be lost during system failures.
6. **Maintainability:** The system should be easy to update and maintain.

## 4. Load Estimation for One Million Users

The following estimates use these assumptions:

- Total registered users: 1,000,000.
- Daily active users: 20% of registered users.
- Daily active users: 200,000.
- Each active user reads 20 notes per day.
- Each active user creates 1 note per day.
- Average note storage size: 2 KB.
- There are 86,400 seconds in one day.

### Read Requests

200,000 users × 20 reads = 4,000,000 reads per day.

Average reads per second:

4,000,000 ÷ 86,400 = approximately 46 reads per second.

### Write Requests

200,000 users × 1 note = 200,000 writes per day.

Average writes per second:

200,000 ÷ 86,400 = approximately 2.3 writes per second.

### Storage Estimation

200,000 notes × 2 KB = 400,000 KB per day.

Approximate daily storage: 400 MB.

Annual storage:

400 MB × 365 = approximately 146 GB per year.

This estimate excludes indexes, backups, replicas, and other database overhead.

## 5. System Architecture Diagram

```text
                  USERS
                    |
                 CLIENT
                    |
                   DNS
                    |
                   CDN
                    |
              LOAD BALANCER
                /       \
               /         \
        APP SERVER 1   APP SERVER 2
               \         /
                \       /
                  CACHE
                    |
              PRIMARY DATABASE
                    |
               READ REPLICA

          APP SERVERS
                |
              QUEUE
                |
              WORKER
```

## 6. Components and Their Responsibilities

1. **Client:** Provides the interface through which users interact with QuickNotes.
2. **DNS:** Converts the application domain name into an IP address.
3. **CDN:** Delivers static files such as CSS, JavaScript, and images closer to users.
4. **Load Balancer:** Distributes incoming requests across available application servers.
5. **Application Servers:** Process requests, validate data, and apply business logic.
6. **Cache:** Stores frequently requested information to reduce database queries and response time.
7. **Primary Database:** Stores permanent user, note, and tag information and handles writes.
8. **Read Replica:** Handles read queries to reduce the workload on the primary database.
9. **Queue:** Stores background tasks for processing outside the main request.
10. **Worker:** Processes queued background tasks such as sending notifications.

## 7. Request Flow: GET /notes

When a user requests their notes:

1. The user opens QuickNotes and requests their notes.
2. DNS resolves the application domain name.
3. The CDN serves available static resources.
4. The load balancer forwards the API request to an available application server.
5. The application server verifies the user's authentication.
6. The server checks the cache for the requested notes.
7. If the notes are in the cache, they are returned to the user.
8. If the notes are not in the cache, the application retrieves them from the read replica.
9. The application stores the retrieved notes in the cache.
10. The server returns the notes to the client as JSON.

## 8. Request Flow: POST /notes

When a user creates a note:

1. The user enters a note title and body.
2. The client sends a POST request containing the note data.
3. DNS resolves the application domain name.
4. The load balancer forwards the request to an available application server.
5. The application server verifies authentication and validates the note data.
6. The server saves the new note in the primary database.
7. The database confirms that the note has been saved.
8. The application may place background tasks in the queue.
9. The server returns a successful response with status code 201 Created.
10. The client displays the new note to the user.

## 9. Architecture Trade-Offs

### Cache vs Database

Caching improves response time and reduces database workload. However, cached information may become outdated. The system should update or invalidate cached notes after changes.

### Read Replicas vs Strong Consistency

Read replicas improve performance by handling more read requests. However, replication delays may cause users to see slightly outdated information. Important updates should be confirmed using the primary database.

### Asynchronous Processing vs Immediate Processing

Queues allow background tasks to run without delaying the main request. However, some tasks may take longer to complete because they are processed later.

## 10. Avoiding Single Points of Failure

The architecture reduces single points of failure through:

1. Running at least two application servers.
2. Using redundant load balancers.
3. Deploying servers across different availability zones.
4. Maintaining a read replica for database recovery and read scaling.
5. Using a replicated cache and durable message queue.
6. Running multiple background workers.
7. Performing regular database backups.
8. Monitoring the system and setting up automatic alerts.

## 11. Conclusion

The QuickNotes architecture uses load balancing, caching, database replication, and background processing to support a growing number of users. These components improve performance, availability, reliability, and scalability.
