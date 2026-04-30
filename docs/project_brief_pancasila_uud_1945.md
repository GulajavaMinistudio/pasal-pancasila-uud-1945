# Project Brief: Pancasila & UUD 1945 Web App

<!-- markdownlint-disable -->
## 1. Project Overview
The **Pancasila & UUD 1945 Web App** is a digital reference platform designed to provide easy and structured access to Indonesia's constitutional texts. Originally an Android application, this project focuses on migrating and modernizing the experience into a high-performance Progressive Web App (PWA).

## 2. Core Objectives
- **Accessibility:** Ensure the 1945 Constitution and Pancasila principles are accessible to anyone, anywhere, on any device.
- **Modern Experience:** Transition from a platform-specific app to a responsive web experience that feels native on both mobile and desktop.
- **Educational Value:** Provide clear, comparative, and searchable content to help citizens and legal professionals understand constitutional changes.

## 3. Key Features
| Feature                  | Description                                                                                      |
| :----------------------- | :----------------------------------------------------------------------------------------------- |
| **Pancasila & Butir**    | Interactive display of the 5 Sila and their detailed practical points (Butir-butir).             |
| **1945 Constitution**    | Full text of the Preamble (Pembukaan) and all Articles (Pasal) post-amendment.                   |
| **Article Search**       | Real-time, client-side fuzzy search across all articles and chapters.                            |
| **Amendment Comparison** | A dedicated view to compare original (1945) articles with their amended versions side-by-side.   |
| **PWA Support**          | Offline access capability, ensuring the constitution is readable without an internet connection. |
| **Deep Linking**         | Shareable URLs for every specific article, chapter, or Sila.                                     |

## 4. Visual Identity
- **Primary Palette:** National Red (#C62828) as the dominant brand color for headers and primary actions.
- **Typography:** Clean, sans-serif fonts (Public Sans) prioritized for high readability of dense legal texts.
- **Layout Philosophy:** Card-based navigation on mobile for thumb-friendly usage, and a structured sidebar-content layout for desktop productivity.

## 5. Technology Stack
- **Frontend:** Vanilla JavaScript (ES6+) for performance and minimal bundle size.
- **Bundler:** Vite for modern development workflow and fast builds.
- **Styling:** Bootstrap 5 for a responsive, accessible, and robust UI framework.
- **Search Engine:** Fuse.js for efficient, client-side fuzzy matching.

## 6. Success Metrics
- **Performance:** Lighthouse score >= 90 across Performance, Accessibility, and SEO.
- **Engagement:** Seamless navigation between historical and current versions of articles.
- **Reliability:** 100% offline functionality for previously visited content via Service Workers.
