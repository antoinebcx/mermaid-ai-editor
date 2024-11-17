# Mermaid AI editor

Create and edit Mermaid diagrams and flowcharts with AI (Claude).

Upload text, code files, PDF and Word documents.

Ask the model for global or targeted changes, or edit directly the code and the diagram.

---
**Demo**
![Screen+Recording+2024-11-17+at+17 36 28_3](https://github.com/user-attachments/assets/672c25a7-5467-40e7-b918-ce6be134287d)

---
**Light mode**
<img width="1321" alt="image" src="https://github.com/user-attachments/assets/7694c150-99a1-4e32-a17b-e156b1034562">

---
**Dark mode**
<img width="1321" alt="image" src="https://github.com/user-attachments/assets/13539bff-5f43-410a-80d2-1bf43f51f97d">

---

**How to use locally**

Add your `ANTHROPIC_API_KEY` to a `.env` file in the server directory and you're good to go!

---

**Copy the diagram code to Markdown files**

GitHub supports Mermaid rendering in Markdown!

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
