# HMI-Project

An HMI (Human–Machine Interface) prototype built in [programming language/framework here] for [brief description: e.g. machine control, monitoring, etc.].

---

## 🔧 Features

- Real-time dashboard displaying machine status (e.g. temperature, pressure, RPMs)
- User interaction: buttons, forms, dynamic visual alarms/status indicators
- Supports [communication protocol: e.g. Modbus/TCP, OPC UA]
- [Add any other features your project includes]

---

## 🛠 Technologies

- **Frontend/UI**: [e.g. React, Qt, Angular, Python‑Tkinter]
- **Backend**: [e.g. Node.js, Flask, .NET Core]
- **Communication**: [e.g. Modbus/TCP, OPC UA client/server + reference links]
- **Data handling**: [e.g. MQTT, WebSockets, REST APIs]
- **Additional libs**: [e.g. charting libraries, CSS frameworks, state management]

---

## 🚀 Getting Started

### Prerequisites

- [Windows/Linux/macOS] with [language runtime version]
- [PLC/HW emulator] or real device supporting [protocol]
- Tools: `git`, [Node.js >= x.y], Python >= x.y, etc.

### Setup

```bash
git clone https://github.com/harshith-byte/HMI-Project.git
cd HMI-Project

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && pip install -r requirements.txt
```
## steps for creating database

###1. Create database in PGAdmin

###2. run the flask app
```
flask run
```

###2. For uploading data to the database
open the url http://127.0.0.1:5000/api/load-data
