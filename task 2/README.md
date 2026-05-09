# Malware Analysis Sandbox - Task 2

## Overview
This project is an automated Malware Analysis Sandbox. 
It uses **Docker** to create an isolated, secure Linux container to execute and analyze simulated malware. 

To create a highly realistic environment, the sandbox utilizes a modern Angular web application (a "Crypto Bank" demo) as a honeypot.
While the malware only needs static files to target, providing a full, realistic directory structure makes the sandbox environment authentic and much closer to a real life scenario.

The sandbox actively monitors and logs:
- **File System Changes:** Detects file creation, modification, and deletion.
- **Network Activity:** Logs simulated outbound connections.
- **Process Activity:** Captures a snapshot of running processes.

I used the **Tkinter** library as a GUI that provides an easy interface to control the sandbox lifecycle and generate the analysis report.

## The Angular Honeypot
The Angular project inside the `bank-project` folder is used as bait for the malware. **It does not need to be actively running for the sandbox to work.** However, if you wish to run the Crypto Bank website locally to see the realistic environment, you can do so:
1. Navigate to the `bank-project` directory.
2. Run `npm install` to install all dependencies (`node_modules` are excluded from the repository).
3. Run `ng serve` to launch the application.
4. Go to `http://localhost:4200/` in your browser (the web app runs locally on your computer).

*(Note: The sensitive "bait" files are located inside the `bank-project/src/env/` folder. This exact folder structure is mirrored inside the Docker container.)*

## Prerequisites
1. **Docker Desktop** (Must be open and running).
2. **Python 3.x**
3. Install the Docker Python library:
   ```bash
   pip install docker

```

## How to Run the Sandbox

1. Open your terminal in the project directory and run:
```bash
python gui.py

```


2. You will now see the GUI control panel. Use the buttons in order (1 to 4) to start the sandbox, execute the malware, generate the analysis report, and cleanly stop the environment.

---

## 🕵️‍♂️ Manual Inspection (Looking Inside the Container)

If you want to see exactly what is happening inside the container itself *after* it starts running, but *before* (or after) the malware attacks, you can manually enter the container using your command prompt.

**Step 1:** Click **"1. Start"** in the GUI to boot up the sandbox container.

**Step 2:** Open a standard Command Prompt (CMD) and enter the running container by typing:

```bash
docker exec -it Nexus_Malware_Sandbox /bin/bash

```

**Step 3:** Navigate to the honeypot "bait" folder. *(Notice this path is exactly the same as your local Angular project's path!)*:

```bash
cd /sandbox/bank-project/src/env/

```

**Step 4:** Inspect the files:

* Type `ls` to see all the files currently in the folder.
* Type `cat passwords.txt` (or any other file name) to read the contents of the file on the screen.

**Pro Tip:** Try reading the files, then go to the GUI and click **"2. Run Malware"**, and then type `cat passwords.txt` again in your CMD. You will see the original data disappear and be replaced by the ransom note in real-time!

When you are done looking around, just type `exit` to leave the container.
