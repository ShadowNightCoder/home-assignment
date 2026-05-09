import docker
import os

os.environ["DOCKER_BUILDKIT"] = "1"

class SandboxManager:
    def __init__(self):
        self.client = docker.from_env()
        self.container = None
        self.image_name = "malware-sandbox-image" #the name i set for the image when it create it 
        self.container_name = "Nexus_Malware_Sandbox"

    #its a look for containers that already run under the same container name so it kill tham
    def _safe_cleanup(self): 
        try:
            old = self.client.containers.get(self.container_name)
            old.stop()
            old.remove()
        except:
            pass

    # so this is the setup for the sandbox environment(its build the image from the dockerfile,
    # make the image run the create container and it keeps it)
    # it create a listening to the things that happened in the contain and put it into logs 
    # (similar to wireshark that listen to the network)
    def build_and_start(self):
        try:
            self._safe_cleanup()
            self.client.images.build(path=".", tag=self.image_name, rm=True, forcerm=True)
            self.container = self.client.containers.run(
                self.image_name,
                name=self.container_name, 
                detach=True,
                tty=True
            )
            monitor_cmd = "nohup inotifywait -m -r -e modify,create,delete /sandbox/bank-project/ > /sandbox/fs_monitor.log 2>&1 &"
            self.container.exec_run(['sh', '-c', monitor_cmd])
            return f"Sandbox running: {self.container.short_id}"
        except Exception as e:
            return str(e)

    # this is the function that send the malware (it make sure the container is runing), 
    # the full malware with all its functions in the dummy_malware file
    def run_malware_test(self):
        try:
            self.container = self.client.containers.get(self.container_name)
        except:
            return "Sandbox not running"
        
        try:
            # Read the malware script from our separated file
            with open('dummy_malware.py', 'r') as file:
                malware_script = file.read()
                
            self.container.exec_run(['python3', '-c', malware_script])
            return "Malware executed successfully"
        except FileNotFoundError:
            return "Error: dummy_malware.py file was not found!"
        except Exception as e:
            return str(e)

    # its takes all the information and the damage that has been done and report it (it says what the malware had done)
    # its read from the log file in the container, use ps aux that give like a screen shoot of all the process that run in the linux
    def generate_report(self):
        try:
            self.container = self.client.containers.get(self.container_name)
            
            fs_log = self.container.exec_run(['cat', '/sandbox/fs_monitor.log']).output.decode('utf-8').strip()
            ps_log = self.container.exec_run(['ps', 'aux']).output.decode('utf-8').strip()
            
            net_res = self.container.exec_run(['cat', '/sandbox/network_activity.log'])
            net_log = net_res.output.decode('utf-8').strip() if net_res.exit_code == 0 else "No network activity logged."

            report = "=== MALWARE ANALYSIS REPORT ===\n\n"
            
            report += "[FILE SYSTEM MODIFICATIONS]\n"
            report += (fs_log if fs_log else "No file system changes detected.") + "\n\n"
            
            report += "[NETWORK ACTIVITY]\n"
            report += net_log + "\n\n"
            
            report += "[PROCESS ACTIVITY SNAPSHOT]\n"
            report += ps_log + "\n"
            
            return report
        except Exception as e:
            return str(e)

    # this kill the container while it write in the gui: Stopping Sandbox...
    def stop_sandbox(self):
        try:
            self._safe_cleanup()
            self.container = None
            return "Sandbox stopped and cleaned up"
        except Exception as e:
            return str(e)