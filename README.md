# CliGUI - Visual CLI Workflow Builder

🖥️ **CliGUI** transforms command-line tools into visual forms. Build complex CLI workflows without memorizing syntax, then export as cross-platform Python scripts.

![CliGUI](https://img.shields.io/badge/Platform-Cross--Platform-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Export-Python-yellow)

## ✨ Features

- **📚 Command Library** - Browse commands organized by OS (Linux, macOS, Windows) and category
- **🎛️ Visual Configuration** - Toggle options, fill parameters with full documentation
- **🔗 Workflow Chaining** - Combine commands with `|`, `&&`, `||`, `;` operators
- **🐍 Cross-Platform Export** - Generate Python scripts that work identically on all platforms
- **📝 YAML-Based** - Easy to add new commands via Pull Requests
- **⚡ Lazy Loading** - Commands loaded on-demand from `commands.json` index

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/cligui.git
cd cligui

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 How to Use

### 1. Select a Command
Browse commands by OS (Linux, macOS, Windows) or use search. Click on a command to configure it.

### 2. Configure Options
- Enable checkbox options to add flags
- Fill in text fields for parameters
- Conflicting options are automatically disabled
- Dependencies are handled (e.g., `-h` requires `-l` for `ls`)
- Use examples to quickly fill common configurations

### 3. Build Workflow
Click **"Add to Workflow"** to chain commands. Use operators to control execution:

| Operator | Name | Description |
|----------|------|-------------|
| `\|` | Pipe | Pass output to next command |
| `&&` | And | Run next only if previous succeeds |
| `\|\|` | Or | Run next only if previous fails |
| `;` | Then | Run next regardless of result |

### 4. Export
Download as a **Python script** that implements chaining logic in pure Python, making it work consistently across all platforms.

## 📁 Project Structure

```
cligui/
├── public/
│   ├── commands.json          # Command index (lazy loading)
│   └── commands/              # YAML command definitions
│       ├── git/
│       │   ├── commit.yaml
│       │   ├── push.yaml
│       │   └── ...
│       ├── core/
│       │   ├── grep.yaml
│       │   ├── sed.yaml
│       │   └── ...
│       ├── docker/
│       ├── files/
│       └── windows/
├── src/
│   ├── App.tsx                # Main application
│   └── ...
└── README.md
```

## 📝 Adding New Commands

### Step 1: Create YAML File

Add a new file to `public/commands/<category>/<command>.yaml`:

```yaml
id: "my-command"
name: "my command"
category: "core"
os: ["linux", "macos"]
description: "What this command does"
base: "mycommand"
difficulty: "beginner"
danger_level: "safe"
tags: ["search", "filter"]

args:
  # Positional argument
  - id: "file"
    name: "File"
    type: "text"
    positional: true
    position: 1
    required: true
    placeholder: "file.txt"
    description: "File to process"
    group: "Input"

  # Flag argument (checkbox)
  - id: "verbose"
    flag: "-v"
    name: "Verbose"
    type: "checkbox"
    default: false
    description: "Enable verbose output"
    group: "Options"

  # Flag with value
  - id: "output"
    flag: "-o"
    name: "Output File"
    type: "text"
    placeholder: "output.txt"
    description: "Write output to file"
    group: "Output"

  # Select dropdown
  - id: "format"
    flag: "--format"
    name: "Format"
    type: "select"
    options:
      - value: "json"
        label: "JSON"
      - value: "xml"
        label: "XML"
    group: "Output"

  # With conflicts/dependencies
  - id: "option-a"
    flag: "-a"
    name: "Option A"
    type: "checkbox"
    conflicts_with: ["option-b"]
    group: "Options"

  - id: "option-b"
    flag: "-b"
    name: "Option B"
    type: "checkbox"
    depends_on: ["option-a"]
    group: "Options"

examples:
  - name: "Basic usage"
    values:
      file: "input.txt"
      verbose: true
    output: "mycommand -v input.txt"
```

### Step 2: Update commands.json

Add an entry to `public/commands.json`:

```json
{
  "id": "my-command",
  "name": "my command",
  "category": "core",
  "os": ["linux", "macos"],
  "description": "What this command does",
  "path": "/commands/core/my-command.yaml"
}
```

### Step 3: Submit PR

1. Fork the repository
2. Create a branch: `git checkout -b add-my-command`
3. Add your YAML file and update commands.json
4. Test locally with `npm run dev`
5. Submit a Pull Request

## 🔧 YAML Schema Reference

### Argument Types

| Type | Description |
|------|-------------|
| `text` | Single-line text input |
| `checkbox` | Boolean toggle |
| `number` | Numeric input with min/max |
| `select` | Dropdown selection |

### Special Fields

| Field | Description |
|-------|-------------|
| `positional: true` | Argument has no flag, position matters |
| `position: N` | Order for positional arguments |
| `required: true` | User must provide value |
| `conflicts_with: []` | Cannot use with these args |
| `depends_on: []` | Requires these args to be set |
| `danger: true` | Marks as potentially destructive |
| `warning: ""` | Warning text for dangerous options |
| `group: ""` | Groups related arguments in UI |

### OS Values

- `linux` - Linux distributions
- `macos` - macOS / Darwin
- `windows` - Windows

## 🐍 Generated Python Script

The exported Python script implements shell-like chaining in pure Python:

```python
#!/usr/bin/env python3
"""
Generated by CliGUI - Cross-platform CLI Workflow
"""

import subprocess
import sys
from typing import Optional, Tuple


def run_command(
    cmd: list[str],
    input_data: Optional[str] = None
) -> Tuple[int, str, str]:
    """Run a command and return (returncode, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            input=input_data,
            capture_output=True,
            text=True
        )
        return result.returncode, result.stdout, result.stderr
    except FileNotFoundError:
        return 127, "", f"Command not found: {cmd[0]}"


def main():
    prev_stdout = None
    prev_code = 0

    # Step 1: ls -l
    cmd_1 = ["ls", "-l"]
    code_1, stdout_1, stderr_1 = run_command(cmd_1)
    prev_code = code_1
    prev_stdout = stdout_1

    # Step 2: grep (Pipe)
    cmd_2 = ["grep", "txt"]
    code_2, stdout_2, stderr_2 = run_command(cmd_2, input_data=prev_stdout)
    prev_code = code_2
    prev_stdout = stdout_2

    if prev_stdout:
        print(prev_stdout, end="")
    
    return prev_code


if __name__ == "__main__":
    sys.exit(main())
```

This works identically on Linux, macOS, and Windows!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add commands or improve the UI
4. Test locally
5. Submit a Pull Request

### Guidelines

- Use lowercase for `id` and `category`
- Include all supported platforms in `os` array
- Add helpful descriptions and examples
- Mark dangerous operations with `danger: true`
- Group related arguments together

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- YAML parsing by js-yaml
- Icons from emoji set
