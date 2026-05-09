import tkinter as tk
from tkinter import scrolledtext
from docker_manager import SandboxManager

# Initialize the manager
manager = SandboxManager()

def start_sandbox_ui():
    log_area.insert(tk.END, "Initializing Sandbox Environment...\n")
    window.update() # Refresh UI
    result = manager.build_and_start()
    log_area.insert(tk.END, result + "\n\n")

def run_malware_ui():
    log_area.insert(tk.END, "Injecting and executing malware...\n")
    window.update()
    result = manager.run_malware_test()
    log_area.insert(tk.END, result + "\n\n")

def stop_sandbox_ui():
    log_area.insert(tk.END, "Stopping Sandbox...\n")
    window.update()
    result = manager.stop_sandbox()
    log_area.insert(tk.END, result + "\n\n")

# Setup Tkinter Window
window = tk.Tk()
window.title("Malware Analysis Sandbox")
window.geometry("600x500")
window.configure(bg="#2d2d2d")

# Title Label
title_label = tk.Label(window, text="Malware Sandbox Controller", font=("Arial", 16, "bold"), bg="#2d2d2d", fg="white")
title_label.pack(pady=10)

# Buttons Frame
button_frame = tk.Frame(window, bg="#2d2d2d")
button_frame.pack(pady=10)

btn_start = tk.Button(button_frame, text="1. Start Sandbox", command=start_sandbox_ui, bg="#4CAF50", fg="white", width=15)
btn_start.grid(row=0, column=0, padx=10)

btn_run = tk.Button(button_frame, text="2. Run Malware", command=run_malware_ui, bg="#ff9800", fg="white", width=15)
btn_run.grid(row=0, column=1, padx=10)

btn_stop = tk.Button(button_frame, text="3. Stop & Clean", command=stop_sandbox_ui, bg="#f44336", fg="white", width=15)
btn_stop.grid(row=0, column=2, padx=10)

# Logs Area
log_label = tk.Label(window, text="Sandbox Activity Log:", font=("Arial", 12), bg="#2d2d2d", fg="white")
log_label.pack(anchor="w", padx=20)

log_area = scrolledtext.ScrolledText(window, width=70, height=18, font=("Courier", 10))
log_area.pack(pady=5)

# Start the GUI
window.mainloop()