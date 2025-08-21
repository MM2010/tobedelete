# AGENTS.md - Frontend Guidelines for the React Native App

This document provides the specific technical guidelines and coding standards for this React Native application. It adapts the principles from the root `AGENTS.md` to a frontend context and introduces rules specific to mobile and Web3 development.

## 1. Naming Conventions

-   **Components & Types/Interfaces**: Use `PascalCase` (e.g., `ProductCard`, `UserDetails`, `IUserService`).
-   **Functions & Variables**: Use `camelCase` (e.g., `getUser`, `productPrice`, `isAuthenticating`).
-   **Hooks**: Use the `use` prefix and `camelCase` (e.g., `useAuthentication`, `useProductList`).
-   **Files**: Component files should be `PascalCase` (e.g., `ProductCard.tsx`). Service and utility files should be `camelCase` (e.g., `authService.ts`).

## 2. Architecture & Project Structure

This project follows a component-based architecture with a clear separation of concerns.

-   **/src**: All source code will reside in a `src` directory.
    -   **/src/components**: Reusable, shared UI components (e.g., `Button.tsx`, `Input.tsx`).
    -   **/src/screens**: Top-level screen components that represent a full view (e.g., `HomeScreen.tsx`, `ProfileScreen.tsx`).
    -   **/src/navigation**: Navigation logic and navigators (e.g., `AppNavigator.tsx`).
    -   **/src/services**: Modules for interacting with external APIs or the backend (e.g., `apiService.ts`, `authService.ts`). This is our **Repository Layer**.
    -   **/src/hooks**: Custom hooks for shared logic.
    -   **/src/state**: State management logic (e.g., stores, contexts).
    -   **/src/utils**: Utility functions.
    -   **/src/styles**: Global styles and theme definitions.
    -   **/src/types**: Shared TypeScript types and interfaces.

## 3. State Management

-   **Local Component State**: Use `useState` and `useReducer` for state confined to a single component.
-   **Server-Side State (Cache)**: Use a dedicated library like **React Query** for managing server state. This aligns with the `Cache-Aside` pattern in the root guidelines, providing caching, re-fetching, and invalidation out of the box.
-   **Global Client State**: Use **React Context** for simple global state. For more complex scenarios, a library like Zustand or Redux may be introduced.

## 4. Code Best Practices & Commenting

-   **Single Responsibility Principle (SRP)**: Components should be small and focused on a single responsibility.
-   **Commenting**: Use **TSDoc** for all exported components, props, hooks, and functions. This is the equivalent of the C# XML documentation requirement.
    ```typescript
    /**
     * Renders a customizable button.
     * @param {object} props - The component props.
     * @param {string} props.title - The text to display on the button.
     * @param {() => void} props.onPress - The function to call when the button is pressed.
     * @returns {JSX.Element} The rendered button component.
     */
    ```
-   **Logging**: Use a structured logging library. All critical operations, errors, and significant state changes should be logged.

## 5. Web3 & Security (MANDATORY)

Security is paramount. The following rules are non-negotiable.

-   **NEVER handle private keys**: All transaction and message signing must be delegated to the user's wallet via WalletConnect. The app must never ask for, see, or store private keys or seed phrases.
-   **Use "Sign-In with Ethereum" (SIWE)**: Follow the SIWE standard for authentication to prevent replay attacks and ensure message integrity. This involves using a server-generated nonce.
-   **Validate Inputs**: Sanitize and validate all user inputs and data from external APIs to prevent XSS and other injection attacks.
-   **Secure Storage**: Use the device's secure keychain/keystore for storing sensitive data like session tokens (JWTs). Avoid using `AsyncStorage` for anything sensitive.
-   **Dependencies**: Regularly audit dependencies for known vulnerabilities.

By following these guidelines, we will build a secure, maintainable, and high-quality React Native application.
