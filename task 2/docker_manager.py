import docker
import os

class SandboxManager:
    def __init__(self):
        # Initialize Docker client (requires Docker Desktop to be running)
        self.client = docker.from_env()
        self.container = None
        self.image_name = "malware-sandbox-image"

    def build_and_start(self):
        try:
            # Step 1: Build the Docker image from the Dockerfile
            print("Building Docker Image... (This might take a minute the first time)")
            self.client.images.build(path=".", tag=self.image_name)
            
            # Step 2: Run the container from the built image
            print("Starting Container...")
            self.container = self.client.containers.run(
                self.image_name,
                detach=True, # Run in background
                tty=True     # Keep it alive
            )
            return f"Success! Sandbox is running.\nContainer ID: {self.container.short_id}"
        except Exception as e:
            return f"Error: {e}"

    def run_malware_test(self):
        if not self.container:
            return "Error: Sandbox is not running yet."
        
        try:
            # We will run a command inside the container that searches for our honeypot files
            # and simulates changing them (like ransomware would do)
            command = 'sh -c "echo \'YOU HAVE BEEN HACKED\' >> /sandbox/bank_project/src/env/passwords.txt"'
            exec_log = self.container.exec_run(command)
            
            return "Malware executed! Modified passwords.txt inside the isolated container."
        except Exception as e:
            return f"Execution Error: {e}"

    def stop_sandbox(self):
        if self.container:
            self.container.stop()
            self.container.remove()
            self.container = None
            return "Sandbox completely destroyed and cleaned up."
        return "No active Sandbox to stop."