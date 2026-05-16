# 💻 IT Interview Preparation App

A comprehensive, modern, and bilingual platform designed to help developers prepare for IT interviews. From core programming concepts to advanced system design and DevOps practices, this app provides curated materials in both Vietnamese and English.

## 🚀 Features

-   **🌐 Bilingual Support**: Seamlessly switch between Vietnamese and English content.
-   **📚 Extensive Topic Coverage**:
    -   **Programming**: Java, Spring, Go, etc.
    -   **Databases**: SQL, NoSQL, ORM, JPA.
    -   **System Design**: Clean Architecture, Design Patterns, SOLID, YAGNI, Message Queues.
    -   **DevOps**: Docker, Kubernetes, CI/CD.
    -   **Frontend**: React, TypeScript, Modern CSS.
-   **🔍 Smart Search**: Quickly find topics across categories with an interactive search modal.
-   **🌙 Dark Mode**: Premium dark/light mode experience that persists across sessions.
-   **📊 Visual Diagrams**: Integrated Mermaid.js support for clear architecture and workflow diagrams.
-   **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠 Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, Radix UI, Lucide Icons
-   **Content**: Markdown-based content management with `react-markdown`
-   **Documentation**: Mermaid.js for diagrams, Prism for syntax highlighting

## 🏃 Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📁 Project Structure

-   `src/content/`: Contains all Markdown files organized by language and category.
-   `src/components/`: Reusable React components.
-   `src/data/`: Category and topic definitions.
-   `src/lib/`: Utility functions and content loaders.
-   `src/styles/`: Global styles and theme configurations.

---

Made with ❤️ by Hyun