# 🚀 Complete Startup Instructions

## Prerequisites Check

### ✅ Verified
- Java 21 installed ✅
- Node.js v24.12.0 installed ✅

### ⚠️ Issues Found
- JAVA_HOME environment variable not set
- Frontend dependencies may need installation

---

## Step-by-Step Startup Guide

### Step 1: Set JAVA_HOME Environment Variable

#### Windows (PowerShell as Administrator)
```powershell
# Find Java installation path
$javaPath = (Get-Command java).Source
$javaHome = Split-Path -Parent (Split-Path -Parent $javaPath)
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "User")

# Verify
$env:JAVA_HOME
```

#### Windows (Command Prompt as Administrator)
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-21"
```

#### Verify JAVA_HOME is set
```powershell
echo $env:JAVA_HOME
```

---

### Step 2: Install Frontend Dependencies

```bash
cd OfflineChatGPT\frontend
npm install
```

This will install:
- React 18.2.0
- Vite 5.0.0
- Axios 1.6.0

---

### Step 3: Start Ollama

**Important**: Ollama must be running before the backend can work!

```bash
ollama serve
```

Wait for: `Listening on 127.0.0.1:11434`

---

### Step 4: Start Backend (Terminal 1)

```bash
cd OfflineChatGPT
mvn spring-boot:run
```

Wait for: `Started OfflineChatGptApplication in X seconds`

---

### Step 5: Start Frontend (Terminal 2)

```bash
cd OfflineChatGPT\frontend
npm run dev
```

Wait for: `Local: http://localhost:5173`

---

### Step 6: Open in Browser

Navigate to: **http://localhost:5173**

---

## Troubleshooting

### Issue: JAVA_HOME not set

**Solution 1: Set temporarily in PowerShell**
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
mvn spring-boot:run
```

**Solution 2: Set permanently**
```powershell
# As Administrator
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-21", "Machine")
```

### Issue: Maven not found

**Solution**:
```bash
# Check Maven is installed
mvn --version

# If not installed, download from https://maven.apache.org/download.cgi
# Add to PATH environment variable
```

### Issue: npm dependencies not installed

**Solution**:
```bash
cd frontend
npm install
npm run dev
```

### Issue: Port already in use

**Backend (7070)**:
```powershell
# Find process using port 7070
netstat -ano | findstr :7070

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Frontend (5173)**:
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Ollama not running

**Solution**:
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

---

## Quick Start Commands

### All in One (if everything is set up)

**Terminal 1: Ollama**
```bash
ollama serve
```

**Terminal 2: Backend**
```bash
cd OfflineChatGPT
mvn spring-boot:run
```

**Terminal 3: Frontend**
```bash
cd OfflineChatGPT\frontend
npm run dev
```

**Browser**:
```
http://localhost:5173
```

---

## Verification

### Check Backend is Running
```bash
curl http://localhost:7070/api/health
```
Expected: `{"status":"UP"}`

### Check Frontend is Running
Open: http://localhost:5173

### Check Ollama is Running
```bash
curl http://localhost:11434/api/tags
```
Expected: List of models

---

## System Requirements

- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 5GB for Ollama model
- **CPU**: 2 cores minimum
- **Internet**: For initial setup only

---

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Ollama | 11434 | http://localhost:11434 |
| Backend | 7070 | http://localhost:7070 |
| Frontend | 5173 | http://localhost:5173 |

---

## Next Steps

1. ✅ Set JAVA_HOME
2. ✅ Install frontend dependencies
3. ✅ Start Ollama
4. ✅ Start Backend
5. ✅ Start Frontend
6. ✅ Open browser
7. ✅ Start chatting!

---

## Support

If you encounter issues:
1. Check all prerequisites are installed
2. Verify all ports are available
3. Check JAVA_HOME is set correctly
4. Check Ollama is running
5. See BUG_FIXES_AND_OPTIMIZATION.md for more solutions

---

**Ready to start? Follow the steps above! 🚀**
