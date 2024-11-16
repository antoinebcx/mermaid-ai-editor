# Mermaid AI editor

Create and edit Mermaid flow charts with AI (Claude).

Upload text, code files, PDF and Word documents.

<img width="1321" alt="image" src="https://github.com/user-attachments/assets/003fb997-d4a6-474c-aa97-6b3f19cabfa3">

_

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

GitHub supports Mermaid in READMEs!
