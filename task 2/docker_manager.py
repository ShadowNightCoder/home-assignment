import docker
import os

# Enable modern, clean building (prevents the 4 intermediate containers safely)
os.environ["DOCKER_BUILDKIT"] = "1"

class SandboxManager:
    def __init__(self):
        self.client = docker.from_env()
        self.container = None
        self.image_name = "malware-sandbox-image"
        self.container_name = "Nexus_Malware_Sandbox"

    def _safe_cleanup(self):
        """Safely targets ONLY our specific Sandbox container."""
        try:
            old = self.client.containers.get(self.container_name)
            old.stop()
            old.remove()
            print(f"Cleaned up old '{self.container_name}' container safely.")
        except docker.errors.NotFound:
            pass # It's perfectly fine if it doesn't exist yet
        except Exception as e:
            print(f"Cleanup warning: {e}")

    def build_and_start(self):
        try:
            # 1. Safely remove ONLY our previous sandbox if it was left running
            self._safe_cleanup()

            print("Building Docker Image... (Clean Build Enabled)")
            # 2. rm=True and forcerm=True tells Docker to ONLY delete the 
            # temporary containers it used to build THIS specific image.
            self.client.images.build(
                path=".", 
                tag=self.image_name, 
                rm=True, 
                forcerm=True
            )
            
            print("Starting the Sandbox Container...")
            self.container = self.client.containers.run(
                self.image_name,
                name=self.container_name, 
                detach=True,
                tty=True
            )
            return f"Success! Sandbox is running flawlessly.\nName: {self.container.name}\nID: {self.container.short_id}"
        except Exception as e:
            return f"Error: {e}"

    def run_malware_test(self):
        try:
            self.container = self.client.containers.get(self.container_name)
        except docker.errors.NotFound:
            return "Error: Sandbox is not running yet. Click Start first."
        
        # THE RANSOMWARE PAYLOAD
        malware_script = """
note = '''========================================
!!! WARNING: YOU HAVE BEEN HACKED !!!
========================================
All sensitive data, including passwords and crypto wallets, has been stolen and encrypted.

To prevent the public release of your private keys and financial data, you must send $4,000,000 USD in Bitcoin to the following address:
bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh

If payment is not received within 48 hours, your data will be published on the dark web.'''

files_to_hack = [
    '/sandbox/bank-project/src/env/passwords.txt',
    '/sandbox/bank-project/src/env/crypto_wallet.txt'
]

for filepath in files_to_hack:
    try:
        with open(filepath, 'w') as f:
            f.write(note)
    except:
        pass
"""
        try:
            command = ['python3', '-c', malware_script]
            self.container.exec_run(command)
            return "CRITICAL ALERT: Ransomware payload executed!\npasswords.txt and crypto_wallet.txt have been wiped and encrypted."
        except Exception as e:
            return f"Execution Error: {e}"

    def stop_sandbox(self):
        try:
            self._safe_cleanup()
            self.container = None
            return "Sandbox safely destroyed. No other containers on this computer were touched."
        except Exception as e:
            return f"Error stopping: {e}"