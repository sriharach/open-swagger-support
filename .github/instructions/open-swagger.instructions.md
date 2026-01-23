---
applyTo: "**"
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Project Context

This project is an open-source API documentation and testing tool that leverages Swagger (OpenAPI) specifications to generate interactive API documentation. The goal is to make it easy for developers to understand, test, and integrate with APIs.

## Coding Guidelines

1. **Code Style**: Follow consistent code formatting and style conventions. Use tools like Prettier or ESLint if applicable.
2. **Documentation**: Ensure that all functions, classes, and modules are well-documented with clear comments and usage examples.
3. **Error Handling**: Implement robust error handling to manage unexpected situations gracefully.

## CSS Guidelines

- use tailwindcss version 4 for styling
- follow existing design patterns and components used in the project

## Code Quality- Write clean, maintainable, and efficient code.

- A folder structure hooks should be followed.

```tsx
import useHookExample from "@/hooks/useHookExample";

const useHookExample = () => {
  // Hook logic here
  return {
    exampleValue: "example",
  };
};
```

- All should be written in TypeScript.
- Use functional components and React hooks for state management and side effects.

```tsx
import useHookExample from "@/hooks/useHookExample";

const ComponentExample = () => {
  const { exampleValue } = useHookExample();

  return <div>{exampleValue}</div>;
};
```

## Testing- Write unit and integration tests to ensure code reliability.

- Use testing frameworks like Jest and React Testing Library.
- Aim for high test coverage and meaningful test cases.
