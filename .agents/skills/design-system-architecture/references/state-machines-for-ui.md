# State Machines for UI Interactions

Using lightweight finite state machines (FSM) to eliminate impossible UI states.

---

## 1. Lightweight React Reducer FSM

Avoid having 5 boolean flags (`isLoading`, `isSuccess`, `isError`, `isEditing`, `isModalOpen`) that can become unsynchronized.

```ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string };

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: string[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "RESET" };

export function uiStateMachine(state: State, action: Action): State {
  switch (state.status) {
    case "idle":
      if (action.type === "FETCH_START") return { status: "loading" };
      return state;

    case "loading":
      if (action.type === "FETCH_SUCCESS") return { status: "success", data: action.payload };
      if (action.type === "FETCH_ERROR") return { status: "error", error: action.error };
      return state;

    case "success":
    case "error":
      if (action.type === "RESET") return { status: "idle" };
      if (action.type === "FETCH_START") return { status: "loading" };
      return state;

    default:
      return state;
  }
}
```
