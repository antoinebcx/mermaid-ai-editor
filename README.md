# Mermaid AI editor

Create and edit Mermaid flow charts with AI (Claude).

Upload text, code files, PDF and Word documents.

<img width="1321" alt="image" src="https://github.com/user-attachments/assets/d58cdd8a-9a7a-42cd-896d-bcf1d0475e98">

_

<img width="1321" alt="image" src="https://github.com/user-attachments/assets/5c709e1a-4a3e-426a-bacc-7bd5066e3e63">

---

**How to use locally**

Add your `ANTHROPIC_API_KEY` to the `.env` file in the server directory and you're good to go!

---

```mermaid
flowchart LR
    Input[/Text • Code • PDF • Doc/]
    Input --> Claude{Claude}
    Claude --> Create[Create Chart]
    Claude --> Edit[Edit Chart]
    Code[IDE] --> Create
    Code --> Edit
    Create & Edit --> Result(Flow chart)
```
