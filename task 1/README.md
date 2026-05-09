# Phishing Email Detector TASK 1

This is a web application built with Angular that scans email content for common phishing indicators. 
It fulfills the requirements for Assignment 1 of the home assignment, including the UI bonus.

## Features
* Accepts `.txt` files containing email content.
* Scans the text for:
    * Suspicious links (IP addresses instead of domains).
    * Spoofed sender addresses (numbers disguised as letters in domains).
    * Urgent or manipulative language.
* Displays a summary of the results and lists the specific indicators found.

## Test Files Included
To make reviewing and testing this project as easy as possible, I have included sample test files in the `public` folder:
* `bad_email.txt`: Contains simulated phishing indicators.
* `good_email.txt`: Contains safe, normal email text.
Feel free to upload these directly into the UI to see the detection engine in action!

## Tech Stack
* Angular 
* TypeScript
* RxJS 
* SCSS for custom styling

## How to Run

1. Make sure you have Node.js and the Angular CLI installed.
2. Clone or download this repository.
3. Open a terminal in the project folder and run:
   npm install
4. After the files are downloaded, run the project by writing the following command in the terminal:
   ng serve
5. To enter the project after it has started running, open your web browser and navigate to:
   http://localhost:4200