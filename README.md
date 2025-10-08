# 🛡️ **SafePrompt**

Local AI Prompt Security Extension

## Overview

SafePrompt is a browser extension that protects users and organizations from accidentally leaking sensitive information into AI chatbots or other online text fields.
It runs entirely locally, detecting risky data patterns (like credentials, API keys, internal project names, or PII) before the data is sent to external models.

No cloud scanning.
No telemetry.
No storage of your input anywhere.

**This is a privacy-first, open project built by a cybersecurity student with a passion for secure and ethical AI adoption.**

## ✨ Core Principles

### Local-Only Analysis:
* All scanning happens in your browser — nothing leaves your device.
* There are no servers, APIs, or third-party trackers.

### User Empowerment:
* SafePrompt does not block or modify content automatically.
* It simply alerts you when something looks sensitive so you can make an informed choice.

### Transparency:
* Every line of code is open for review.
* You can verify that no network calls are made and that detection logic runs locally.

### Customizable:
Users and teams can add their own detection rules (e.g., custom regex for internal code names or project terms).

## ⚙️ How It Works

### When you open a page that includes an AI text box (like ChatGPT or Gemini):

The content script listens for user input events.
Before data is sent, SafePrompt checks your text for known risky patterns (e.g., "-----BEGIN PRIVATE KEY-----").
If a match is detected, a local alert appears — offering to redact or cancel the message.
The popup UI allows you to toggle protection or view what was detected.

### SafePrompt runs entirely within Chrome’s extension sandbox using:

* Manifest V3
* JavaScript for real-time scanning
* Regex and pattern-based heuristics for detection
* Chrome storage for local settings

## 🧠 Detection Philosophy

### Rather than sending prompts to a server for classification, SafePrompt uses:

* Lightweight regex detection for obvious secrets and identifiers
* Optional entropy analysis for detecting keys or hashes
* (Planned) local AI model integration — e.g., a quantized LLM running in-browser to classify sensitive context without network calls

**This makes SafePrompt fast, private, and trustworthy.**

## 🔐 Security Model
* Component	Trust Model	Data Flow
* Popup UI	Fully local	Reads/writes only extension storage
* Content Script	Runs in user browser	Monitors and analyzes local DOM
* Background Service Worker	Facilitates settings + messaging	No network requests allowed
* External APIs	None	All calls restricted by CSP policy

### Network policy:
SafePrompt’s manifest.json uses strict permissions and content_security_policy to ensure:
'''
"permissions": ["storage", "activeTab", "scripting"],
"host_permissions": ["<all_urls>"],
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self';"
}
'''

**No external scripts. No fetch requests. No hidden analytics.**

## 🧰 Tech Stack

HTML/CSS/JS (Manifest V3)

Local storage APIs for persistence

Regex-based detection engine (detector.js)

Popup UI built with simple HTML/CSS

**No frameworks for maximal transparency**

## 🧩 Features (Current + Planned)
Status	Feature\
 ✅	    Popup toggle (Enable/Disable protection)\
 ✅	    Local storage of user settings\
 ✅	    Content script detection pipeline\
 🚧	    Custom detection rules (user-defined regex)\
 🚧	    Redaction preview before sending\
 🚧	    Export/import of detection settings\
 🚧	    Optional in-browser local AI classifier (WASM or quantized LLM)\

## 🧱 Installation (Developer Mode)

Clone the repo:
'''
git clone https://github.com/yourusername/safeprompt
cd safeprompt
'''

*Open Chrome → chrome://extensions/*

*Enable Developer mode*

*Click Load unpacked*

*Select the project folder*

*Click the SafePrompt icon → test your popup*

## 🧑‍💻 About the Creator

SafePrompt was built by a Cybersecurity student at RIT who’s passionate about ethical AI, privacy, and secure software design.
This project combines the worlds of AI, browser security, and human-centered design — empowering users to stay safe in an increasingly AI-driven internet.

(No personal data or contact info included for privacy reasons.)

## 🧩 License

MIT License — use, fork, and build on it freely.
If you create a fork, please preserve the transparency and privacy-first principles.

## 🧭 Vision

The long-term goal is to make SafePrompt the “seatbelt” of AI chat —
always on, invisible until needed, and protecting users without slowing them down.

### Eventually, SafePrompt could expand to:

* Local team policies for enterprise users

* Integration with VS Code or Jupyter for developer safety

* Companion app for verifying redactions before LLM ingestion
