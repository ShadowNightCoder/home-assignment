import tkinter as tk
from tkinter import scrolledtext
from docker_manager import SandboxManager

manager = SandboxManager()

def start_sandbox_ui():
    log_area.insert(tk.END, "Starting Sandbox...\n")
    window.update()
    result = manager.build_and_start()
    log_area.insert(tk.END, result + "\n\n")
    log_area.see(tk.END)

def run_malware_ui():
    log_area.insert(tk.END, "Executing malware...\n")
    window.update()
    result = manager.run_malware_test()
    log_area.insert(tk.END, result + "\n\n")
    log_area.see(tk.END)

def generate_report_ui():
    log_area.insert(tk.END, "Generating report...\n")
    window.update()
    result = manager.generate_report()
    log_area.insert(tk.END, result + "\n\n")
    log_area.see(tk.END)

def stop_sandbox_ui():
    log_area.insert(tk.END, "Stopping Sandbox...\n")
    window.update()
    result = manager.stop_sandbox()
    log_area.insert(tk.END, result + "\n\n")
    log_area.see(tk.END)

window = tk.Tk()
window.title("Malware Analysis Sandbox")
window.geometry("850x650")
window.configure(bg="#1e1e1e")

title_label = tk.Label(window, text="Malware Sandbox Controller", font=("Arial", 16, "bold"), bg="#1e1e1e", fg="white")
title_label.pack(pady=10)

button_frame = tk.Frame(window, bg="#1e1e1e")
button_frame.pack(pady=10)

btn_start = tk.Button(button_frame, text="1. Start", command=start_sandbox_ui, bg="#4CAF50", fg="white", width=15)
btn_start.grid(row=0, column=0, padx=10)

btn_run = tk.Button(button_frame, text="2. Run Malware", command=run_malware_ui, bg="#ff9800", fg="white", width=15)
btn_run.grid(row=0, column=1, padx=10)

btn_report = tk.Button(button_frame, text="3. Generate Report", command=generate_report_ui, bg="#2196F3", fg="white", width=15)
btn_report.grid(row=0, column=2, padx=10)

btn_stop = tk.Button(button_frame, text="4. Stop & Clean", command=stop_sandbox_ui, bg="#f44336", fg="white", width=15)
btn_stop.grid(row=0, column=3, padx=10)

log_area = scrolledtext.ScrolledText(window, width=100, height=30, font=("Consolas", 10), bg="#2d2d2d", fg="#00ff00")
log_area.pack(pady=10)

window.mainloop()