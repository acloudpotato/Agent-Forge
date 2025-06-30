# Agent Forge

<p align="center">
  An application for rapidly creating and deploying AI agents.
</p>

## About The Project

Agent Forge is a Next.js application designed to streamline the creation of AI agents. Users can describe the agent they need, and the platform uses generative AI (powered by Google's Gemini through Genkit) to generate a complete agent profile, including a name, description, features, and even a "Getting Started" guide.

This project serves as a powerful demonstration of how to integrate modern web technologies with cutting-edge AI to build dynamic, intelligent applications.

### Built With

*   [Next.js](https://nextjs.org/) (with App Router)
*   [React](https://reactjs.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [ShadCN UI](https://ui.shadcn.com/)
*   [Genkit](https://firebase.google.com/docs/genkit)
*   [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  **Set up your Environment Variables:**
    *   Create a `.env` file in the root of your project. You can copy the example file to get started:
        ```sh
        cp .env.example .env
        ```
    *   Add your secrets to the new `.env` file:
        *   `GOOGLE_API_KEY`: Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
        *   `JWT_SECRET`: Generate a secure secret key by running this command in your terminal: `openssl rand -base64 32`.

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

4.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Project Structure

Here's an overview of the key directories in the project:

*   `src/app/`: Contains the core application pages and layouts, following the Next.js App Router structure.
    *   `login/`: The public login page.
    *   `page.tsx`: The main application page after login.
    *   `actions.ts`: Server Actions for handling form submissions and mutations.
*   `src/components/`: Houses all the reusable React components.
    *   `ui/`: Contains the base UI components from ShadCN.
    *   Other components are specific to the application's features (e.g., `agent-forge-form.tsx`).
*   `src/ai/`: All AI-related logic using Genkit.
    *   `flows/`: Contains the Genkit flows that define the AI's capabilities (e.g., suggesting features, generating agent details).
    *   `genkit.ts`: The main Genkit configuration file.
*   `src/lib/`: Utility functions, type definitions, and services.
    *   `auth.ts`: Handles session management and authentication logic using `jose`.
    *   `types.ts`: TypeScript type definitions used throughout the app.
*   `src/middleware.ts`: Handles routing protection, redirecting users based on their authentication status.

## Authentication

The application uses a simple JWT-based session management system found in `src/lib/auth.ts`. For this prototype, any email and password combination will successfully log you in. The middleware (`src/middleware.ts`) protects all application routes, redirecting unauthenticated users to the `/login` page.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
