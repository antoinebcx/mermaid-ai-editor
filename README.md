# Mermaid AI editor

Create and edit Mermaid diagrams with AI (Claude).

Upload text, code files, PDF and Word documents. Ask AI or edit directly the code and the diagram.

![Screen+Recording+2024-11-17+at+02 35 46](https://github.com/user-attachments/assets/d7d21cad-67bd-4b05-9794-3c9efaaa15fb)

---

<img width="1321" alt="image" src="https://github.com/user-attachments/assets/5f867cc5-6046-476d-904a-8ee2135b09ae">

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

GitHub supports Mermaid rendering in Markdown!
