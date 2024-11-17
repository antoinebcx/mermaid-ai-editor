export const NAVBAR_HEIGHT = 64;
export const MAX_HISTORY_LENGTH = 100000;
export const DEFAULT_DIAGRAM = `flowchart TD
    A(Email) --> C[Process Message]
    B(SMS) --> C
    C --> D{Valid Order?}
    D -->|Yes| E[Create Order]
    D -->|No| F[Reject Request]
    E --> G(Send Confirmation)
    E --> H(Update Inventory)
    F --> I(Send Rejection Notice)`;