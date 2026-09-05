# Learning notes

## JSON data

JSON is a text format for storing and sharing data. It uses keys and values.

```json
{
  "name": "Alex Rivera",
  "currentDays": 12
}
```

In this project, `sim-data/data.json` temporarily acts like a backend response. It contains mock application data and one deliberately fake local test password for mock-login practice. It does not contain a real account or production secret.

## A React component

A component is a JavaScript function that returns the user interface it should display.

```jsx
function Greeting() {
  return <h1>Good evening, Alex</h1>;
}
```

## Props

Props are values a parent component gives to a child component. They let one reusable component display different data.

```jsx
import PropTypes from "prop-types";

function StreakCard({ days }) {
  return <p>{days} days</p>;
}

StreakCard.propTypes = {
  days: PropTypes.number.isRequired,
};

<StreakCard days={12} />
```

`PropTypes.number.isRequired` gives a development warning when `days` is missing or is not a number.

## Context API

Context lets several components use the same data without passing it through every component in between.

```jsx
import { createContext, useContext } from "react";

const UserContext = createContext(null);

function Profile() {
  const user = useContext(UserContext);

  return <p>{user.name}</p>;
}
```

## Mock authentication

Mock authentication copies the shape of signup and login without connecting to a real backend. It is useful for learning and interface testing only.

```jsx
const result = signIn(email, password);

if (result.success) {
  navigate("/dashboard");
}
```

## Junior React interview practice

### 1. What is React?

React is a JavaScript library for building user interfaces from reusable components.

### 2. What is a component?

A component is a JavaScript function that returns JSX describing part of the screen.

```jsx
function Welcome() {
  return <h1>Welcome</h1>;
}
```

### 3. What is JSX?

JSX is syntax that looks like HTML inside JavaScript. React converts it into browser elements.

```jsx
const title = <h1>CodeTrack</h1>;
```

### 4. What are props?

Props are read-only values a parent sends to a child component.

```jsx
function Greeting({ name }) {
  return <p>Hello, {name}</p>;
}
```

### 5. What is state?

State is data that belongs to a component and can change over time. Updating state tells React to render the component again.

### 6. What is the difference between props and state?

Props come from a parent and should not be changed by the child. State is owned and updated by the component that creates it.

### 7. What does `useState` do?

`useState` gives a component a value and a function for changing that value.

```jsx
const [count, setCount] = useState(0);

setCount(count + 1);
```

### 8. What is a controlled form input?

A controlled input gets its value from React state and updates that state when the user types.

```jsx
<input value={email} onChange={(event) => setEmail(event.target.value)} />
```

### 9. How do you handle a button click in React?

Pass a function to an event prop such as `onClick`.

```jsx
<button onClick={handleSave}>Save</button>
```

### 10. How do you conditionally render something?

Use normal JavaScript, such as `&&`, a ternary, or an `if` statement.

```jsx
{isLoggedIn ? <Dashboard /> : <SignIn />}
```

### 11. Why do lists need a `key` prop?

A key gives each list item a stable identity so React can update the list correctly.

```jsx
{goals.map((goal) => (
  <li key={goal.id}>{goal.title}</li>
))}
```

### 12. What does it mean to lift state up?

Move shared state to the closest parent of the components that need it. The parent then passes the data and update functions down as props.

### 13. What is the Context API for?

Context shares data with components below a provider without passing the same props through every level. This project uses it for dashboard and authentication data.

### 14. What is `useEffect` for?

Use `useEffect` to synchronize with something outside React, such as an API request, browser event, timer, or third-party library.

### 15. What is the dependency array in `useEffect`?

It lists the values an Effect uses. React runs the Effect again when one of those values changes.

```jsx
useEffect(() => {
  document.title = pageTitle;
}, [pageTitle]);
```

### 16. Why return a cleanup function from `useEffect`?

Cleanup stops work that the Effect started, such as an interval or event listener, when the component is removed or dependencies change.

```jsx
useEffect(() => {
  const timerId = setInterval(updateClock, 1000);

  return () => clearInterval(timerId);
}, []);
```

### 17. What is `useRef` for?

`useRef` stores a value between renders without causing another render. A common use is focusing an input element.

```jsx
inputRef.current.focus();
```

### 18. What is `useMemo` for?

`useMemo` caches the result of a calculation between renders. Use it only when a calculation is expensive or a stable value is genuinely needed.

### 19. What is `useCallback` for?

`useCallback` caches a function definition between renders. It is a performance tool, not something to add everywhere.

### 20. What are PropTypes?

PropTypes document the kind of props a reusable component expects and warn during development when a prop has the wrong type.

```jsx
MetricCard.propTypes = {
  value: PropTypes.number.isRequired,
};
```

## Official references

- [React: Describing the UI](https://react.dev/learn/describing-the-ui)
- [React: Adding interactivity](https://react.dev/learn/adding-interactivity)
- [React: Passing data with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: `useEffect`](https://react.dev/reference/react/useEffect)
