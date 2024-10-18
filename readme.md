


## Application Overview

This project focuses on the full flow of processing CSV files and image handling, from file upload to image compression, storage in AWS S3, and returning processed results. The key features include:

`Note`: To test the application, use a CSV file formatted as shown here: [Link to sample csv file](https://docs.google.com/spreadsheets/d/1Z_FfReSMCGYQajYKQwEt46LSO2rwVPywnY-ywxbeM60/edit?usp=sharing)

1. **Frontend**: User interface for uploading CSV files and checking the status of processed files: [Deployed link](https://csv-file-processing-frontend.onrender.com)
2. **Backend**: File upload handling, image processing, S3 integration, and database interaction.
3. **Database**: PostgreSQL database for storing metadata and tracking `requestId`.
4. **AWS S3**: Used for storing both original and processed images, as well as CSV files.
5. **Amazon SQS and SNS**: To handle file upload notifications and trigger the CSV processing flow.
6. **AWS Lambda**: To trigger CSV processing when a file is uploaded to S3.

---

## Technologies Used

1. **Frontend** (React with Bootstrap)
2. **Backend** (Node.js, Express.js)
3. **Database** (PostgreSQL via Knex.js)
4. **AWS S3, SNS, SQS, Lambda** (Amazon Web Services)

---

## Application Workflow

![Alt text](./application-workflow.png)

### 1. **CSV File Upload**
- The user uploads a CSV file via the **FileUploadForm** in the frontend.
- The frontend sends a `POST` request to `/upload-csv` on the backend, requesting a presigned URL for direct S3 upload.
- The frontend then uses this presigned URL to upload the file directly to S3.

### 2. **Notification and File Processing**
- Once the file is uploaded to S3, **SNS** sends a notification to **SQS**, which in turn triggers an **AWS Lambda** function.
- The Lambda function calls the backend route `/process-csv` to start processing the uploaded file.
- The backend retrieves the file from S3, parses the CSV, and processes the image URLs in the file.

### 3. **Stream-based CSV Processing**
- The application uses a streaming approach to read the data directly from S3, improving efficiency for large files.
- Each processed chunk is stored in a temporary file on the server.
- Once the stream completes, the application uploads the processed CSV file to S3 and generates an access link.

### 4. **Storing Metadata and Generating Access Link**
- After processing, the download link for the updated CSV is stored in the PostgreSQL database along with the `requestId`.
- The temporary file on the server is deleted after the upload to S3 is complete.

### 5. **Retrieving Processed CSV**
- Users can use their `requestId` to check the status or download the processed CSV file.
- The frontend sends a `GET` request to `/get-processed-csv/:requestId`, and if the processing is complete, the backend returns the updated CSV file's S3 download link.

---

## Summary of Architecture

- **S3** is used for file storage.
- **SNS** notifies **SQS** about file uploads, triggering a **Lambda** function.
- The backend uses streams to read the CSV file from S3 while processing it, stores processed chunks in a temporary local file, and upon completion, uploads the new CSV to S3.
- The processed file link is saved in the database and can be retrieved via the `requestId`.

---

This architecture ensures a scalable and efficient system for handling large CSV files and image processing.