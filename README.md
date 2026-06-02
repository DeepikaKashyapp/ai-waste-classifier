# ♻️ AI Waste Classifier

An intelligent, full-stack waste management application designed to automate waste segregation using advanced computer vision. The system detects and classifies various types of waste in real-time, helping users dispose of trash responsibly and efficiently.

The live application frontend is available at: [AI Waste Classifier Live](https://ephemeral-duckanoo-f4aaee.netlify.app/)

---

## 🚀 Key Features
* **Real-time Detection:** Powered by modern computer vision to identify waste objects instantly via camera or image uploads.
* **Smart Classification:** Automatically categorizes waste into relevant groups (e.g., Organic, Recyclable, Hazardous, Plastic) to ensure proper disposal.
* **Seamless Full-Stack Integration:** Features a highly responsive frontend combined with a lightweight, high-performance Python Machine Learning backend.

---

## 🛠️ Tech Stack

### Frontend & User Interface
* **Framework:** React / Next.js (or Vite, depending on your setup)
* **Styling:** Tailwind CSS
* **Deployment:** Netlify

### Machine Learning & Backend
* **Object Detection Model:** YOLOv8 (Ultralytics)
* **Backend Framework:** Flask (Python)

---

## 💻 Getting Started & Installation

Follow these steps to set up and run the complete project locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [Python 3.8+](https://www.python.org/)

### 2. Setting Up the Web Frontend
Open your terminal at the root directory of the project and run:

```bash
# Install project dependencies
npm i

# Start the local development server
npm run dev
