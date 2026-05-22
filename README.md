# HUGPONG - Agricultural Management Platform

An offline-first agricultural management system designed specifically for sugarcane block farm operations in Silay City. This capstone project bridges the gap between field-level manual data collection and regional administrative oversight through a unified mobile application and web dashboard ecosystem.

## Project Structure

*   **/mobile**
    React Native (Expo) application utilizing AsyncStorage for offline-first data caching. Designed for Field Members and Farm Managers to log the 8-stage crop cycle without requiring an active internet connection.
*   **/admin**
    Web-based administration console built with HTML, CSS (Tailwind CSS v4), and JavaScript. Designed for Farm Managers and SRA Checkers to review descriptive analytics, track weekly SRA sugar prices, and generate certified audit reports.
*   **server.js**
    Custom Node.js (Express) backend server designed to handle database management and offline-to-cloud synchronization from the mobile application.

## Core Technical Features

*   **Offline-First Architecture**: Field logs are cached locally on the device using AsyncStorage when internet connectivity is unavailable, and automatically synchronized to the server once connection is restored.
*   **Standardized 8-Stage Crop Cycle**: Enforces strict chronological agricultural tracking (from Land Preparation to Ratooning) to ensure accurate operational data.
*   **Role-Based Access Control (RBAC)**: Strict permission tiers separating Field Members, Farm Managers, SRA Checkers, and Super Admins.
*   **SRA QR Audit Verification**: End-to-end audit capability allowing SRA Checkers to verify and certify field operation logs via encrypted hash codes.

## Getting Started

To run the complete HUGPONG ecosystem locally, utilize the provided batch scripts in the root directory:

1.  **Start the Backend Server**
    Run `run-server.bat` to initialize the Node.js backend.
2.  **Start the Mobile Application**
    Run `run-mobile.bat` to launch the React Native Expo server.
3.  **Start the Admin Web Dashboard**
    Run `run-admin.bat` to open the local administrative console in your default web browser.

---
Developed as a Capstone Project for Agricultural Information Systems.
