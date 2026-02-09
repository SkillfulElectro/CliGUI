// ============================================
// Types
// ============================================

export interface CommandArg {
  id: string;
  name: string;
  type: 'text' | 'checkbox' | 'number' | 'select';
  flag?: string;
  positional?: boolean;
  position?: number;
  required?: boolean;
  default?: unknown;
  placeholder?: string;
  description?: string;
  warning?: string;
  danger?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  depends_on?: string[];
  conflicts_with?: string[];
  group?: string;
}

export interface CommandMeta {
  id: string;
  name: string;
  category: string;
  os: string[];
  description: string;
  path?: string;
}

export interface CommandFull extends CommandMeta {
  base: string;
  difficulty?: string;
  danger_level?: string;
  tags?: string[];
  args?: CommandArg[];
  examples?: { name: string; values: Record<string, unknown>; output: string }[];
}

export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  description?: string;
  order: number;
}

export interface CommandIndex {
  version: string;
  commands: CommandMeta[];
  categories: CategoryMeta[];
}

export interface ChainItem {
  id: string;
  command: CommandFull;
  values: Record<string, unknown>;
  operator?: '|' | '&&' | '||' | ';';
}

export type OS = 'all' | 'linux' | 'macos' | 'windows';

// ============================================
// Categories
// ============================================

export const CATEGORIES: CategoryMeta[] = [
  { id: 'navigation', name: 'Navigation', icon: '📂', order: 1 },
  { id: 'files', name: 'File Operations', icon: '📄', order: 2 },
  { id: 'text', name: 'Text Processing', icon: '📝', order: 3 },
  { id: 'permissions', name: 'Permissions', icon: '🔐', order: 4 },
  { id: 'process', name: 'Processes', icon: '⚙️', order: 5 },
  { id: 'system', name: 'System Info', icon: '💻', order: 6 },
  { id: 'users', name: 'User Management', icon: '👤', order: 7 },
  { id: 'network', name: 'Networking', icon: '🌐', order: 8 },
  { id: 'packages', name: 'Package Mgmt', icon: '📦', order: 9 },
  { id: 'disk', name: 'Disk Management', icon: '💾', order: 10 },
  { id: 'compression', name: 'Compression', icon: '🗜️', order: 11 },
  { id: 'search', name: 'Search & Help', icon: '🔍', order: 12 },
  { id: 'git', name: 'Git', icon: '🔀', order: 13 },
  { id: 'docker', name: 'Docker', icon: '🐳', order: 14 },
];

// ============================================
// All Commands
// ============================================

export const ALL_COMMANDS: Record<string, CommandFull> = {
  // ══════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════
  'ls': {
    id: 'ls', name: 'ls', category: 'navigation', os: ['linux', 'macos'],
    description: 'List directory contents', base: 'ls',
    args: [
      { id: 'path', name: 'Path', type: 'text', positional: true, position: 1, placeholder: '.', group: 'Source' },
      { id: 'long', flag: '-l', name: 'Long Format', type: 'checkbox', default: false, description: 'Detailed listing with permissions, size, date', group: 'Format' },
      { id: 'all', flag: '-a', name: 'All (hidden)', type: 'checkbox', default: false, description: 'Include hidden files starting with .', group: 'Filter' },
      { id: 'almost-all', flag: '-A', name: 'Almost All', type: 'checkbox', default: false, description: 'Like -a but exclude . and ..', conflicts_with: ['all'], group: 'Filter' },
      { id: 'human', flag: '-h', name: 'Human Readable', type: 'checkbox', default: false, description: 'Show sizes as K, M, G', depends_on: ['long'], group: 'Format' },
      { id: 'size-sort', flag: '-S', name: 'Sort by Size', type: 'checkbox', default: false, conflicts_with: ['time-sort'], group: 'Sort' },
      { id: 'time-sort', flag: '-t', name: 'Sort by Time', type: 'checkbox', default: false, conflicts_with: ['size-sort'], group: 'Sort' },
      { id: 'reverse', flag: '-r', name: 'Reverse Order', type: 'checkbox', default: false, group: 'Sort' },
      { id: 'recursive', flag: '-R', name: 'Recursive', type: 'checkbox', default: false, description: 'List subdirectories recursively', group: 'Options' },
      { id: 'one-per-line', flag: '-1', name: 'One Per Line', type: 'checkbox', default: false, group: 'Format' },
    ],
    examples: [
      { name: 'Detailed with sizes', values: { long: true, all: true, human: true }, output: 'ls -l -a -h' },
      { name: 'Sort by size desc', values: { long: true, 'size-sort': true, reverse: true }, output: 'ls -l -S -r' },
    ]
  },
  'cd': {
    id: 'cd', name: 'cd', category: 'navigation', os: ['linux', 'macos', 'windows'],
    description: 'Change the current working directory', base: 'cd',
    args: [
      { id: 'directory', name: 'Directory', type: 'text', positional: true, position: 1, placeholder: '/path/to/dir', description: 'Directory to change to. Use ~ for home, - for previous', group: 'Target' },
    ],
    examples: [
      { name: 'Go home', values: { directory: '~' }, output: 'cd ~' },
      { name: 'Go up', values: { directory: '..' }, output: 'cd ..' },
    ]
  },
  'pwd': {
    id: 'pwd', name: 'pwd', category: 'navigation', os: ['linux', 'macos'],
    description: 'Print current working directory', base: 'pwd',
    args: [
      { id: 'physical', flag: '-P', name: 'Physical', type: 'checkbox', default: false, description: 'Resolve all symlinks', group: 'Options' },
      { id: 'logical', flag: '-L', name: 'Logical', type: 'checkbox', default: false, description: 'Use PWD from environment', conflicts_with: ['physical'], group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // FILE OPERATIONS
  // ══════════════════════════════════════════
  'mkdir': {
    id: 'mkdir', name: 'mkdir', category: 'files', os: ['linux', 'macos', 'windows'],
    description: 'Create directories', base: 'mkdir',
    args: [
      { id: 'directory', name: 'Directory', type: 'text', positional: true, position: 1, required: true, placeholder: 'new-folder', group: 'Target' },
      { id: 'parents', flag: '-p', name: 'Create Parents', type: 'checkbox', default: false, description: 'Create parent directories as needed', group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, description: 'Print each created directory', group: 'Options' },
      { id: 'mode', flag: '-m', name: 'Mode', type: 'text', placeholder: '755', description: 'Set permission mode', group: 'Options' },
    ],
    examples: [
      { name: 'Nested dirs', values: { directory: 'a/b/c', parents: true }, output: 'mkdir -p a/b/c' },
    ]
  },
  'rmdir': {
    id: 'rmdir', name: 'rmdir', category: 'files', os: ['linux', 'macos', 'windows'],
    description: 'Remove empty directories', base: 'rmdir',
    args: [
      { id: 'directory', name: 'Directory', type: 'text', positional: true, position: 1, required: true, placeholder: 'empty-folder', group: 'Target' },
      { id: 'parents', flag: '-p', name: 'Remove Parents', type: 'checkbox', default: false, description: 'Remove parent dirs if they become empty', group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'touch': {
    id: 'touch', name: 'touch', category: 'files', os: ['linux', 'macos'],
    description: 'Create empty file or update timestamp', base: 'touch',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'newfile.txt', group: 'Target' },
      { id: 'no-create', flag: '-c', name: 'No Create', type: 'checkbox', default: false, description: 'Do not create file if it does not exist', group: 'Options' },
      { id: 'access-only', flag: '-a', name: 'Access Time Only', type: 'checkbox', default: false, group: 'Options' },
      { id: 'mod-only', flag: '-m', name: 'Modify Time Only', type: 'checkbox', default: false, group: 'Options' },
      { id: 'timestamp', flag: '-t', name: 'Timestamp', type: 'text', placeholder: '202401011200', description: 'Use specified time [[CC]YY]MMDDhhmm[.ss]', group: 'Options' },
    ],
  },
  'cp': {
    id: 'cp', name: 'cp', category: 'files', os: ['linux', 'macos'],
    description: 'Copy files and directories', base: 'cp',
    args: [
      { id: 'source', name: 'Source', type: 'text', positional: true, position: 1, required: true, placeholder: 'source.txt', group: 'Paths' },
      { id: 'destination', name: 'Destination', type: 'text', positional: true, position: 2, required: true, placeholder: 'dest.txt', group: 'Paths' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, description: 'Copy directories recursively', group: 'Options' },
      { id: 'interactive', flag: '-i', name: 'Interactive', type: 'checkbox', default: false, description: 'Prompt before overwrite', conflicts_with: ['force'], group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, description: 'Force overwrite', danger: true, conflicts_with: ['interactive'], group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'preserve', flag: '-p', name: 'Preserve', type: 'checkbox', default: false, description: 'Preserve permissions, timestamps', group: 'Options' },
      { id: 'no-clobber', flag: '-n', name: 'No Clobber', type: 'checkbox', default: false, description: 'Do not overwrite existing', group: 'Options' },
    ],
    examples: [
      { name: 'Copy directory', values: { source: 'mydir/', destination: 'backup/', recursive: true }, output: 'cp -r mydir/ backup/' },
    ]
  },
  'mv': {
    id: 'mv', name: 'mv', category: 'files', os: ['linux', 'macos'],
    description: 'Move or rename files and directories', base: 'mv',
    args: [
      { id: 'source', name: 'Source', type: 'text', positional: true, position: 1, required: true, placeholder: 'old-name.txt', group: 'Paths' },
      { id: 'destination', name: 'Destination', type: 'text', positional: true, position: 2, required: true, placeholder: 'new-name.txt', group: 'Paths' },
      { id: 'interactive', flag: '-i', name: 'Interactive', type: 'checkbox', default: false, description: 'Prompt before overwrite', conflicts_with: ['force'], group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, conflicts_with: ['interactive'], group: 'Options' },
      { id: 'no-clobber', flag: '-n', name: 'No Clobber', type: 'checkbox', default: false, description: 'Do not overwrite existing', group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'rm': {
    id: 'rm', name: 'rm', category: 'files', os: ['linux', 'macos'],
    description: 'Remove files or directories', base: 'rm', danger_level: 'dangerous',
    args: [
      { id: 'path', name: 'Path', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Target' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, danger: true, warning: '⚠️ Deletes everything inside!', group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, warning: '⚠️ No confirmation!', conflicts_with: ['interactive'], group: 'Options' },
      { id: 'interactive', flag: '-i', name: 'Interactive', type: 'checkbox', default: false, conflicts_with: ['force'], group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'dir', flag: '-d', name: 'Empty Dirs', type: 'checkbox', default: false, description: 'Remove empty directories', conflicts_with: ['recursive'], group: 'Options' },
    ],
    examples: [
      { name: 'Remove dir', values: { path: 'folder/', recursive: true, verbose: true }, output: 'rm -r -v folder/' },
    ]
  },
  'ln': {
    id: 'ln', name: 'ln', category: 'files', os: ['linux', 'macos'],
    description: 'Create links between files', base: 'ln',
    args: [
      { id: 'target', name: 'Target', type: 'text', positional: true, position: 1, required: true, placeholder: '/path/to/target', group: 'Paths' },
      { id: 'link-name', name: 'Link Name', type: 'text', positional: true, position: 2, placeholder: 'link-name', group: 'Paths' },
      { id: 'symbolic', flag: '-s', name: 'Symbolic', type: 'checkbox', default: false, description: 'Create symbolic (soft) link', group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, description: 'Remove existing destination', danger: true, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Symlink', values: { target: '/usr/bin/python3', 'link-name': 'python', symbolic: true }, output: 'ln -s /usr/bin/python3 python' },
    ]
  },
  'find': {
    id: 'find', name: 'find', category: 'files', os: ['linux', 'macos'],
    description: 'Search for files in directory hierarchy', base: 'find',
    args: [
      { id: 'path', name: 'Path', type: 'text', positional: true, position: 1, placeholder: '.', group: 'Source' },
      { id: 'name', flag: '-name', name: 'Name Pattern', type: 'text', placeholder: '*.txt', group: 'Match' },
      { id: 'iname', flag: '-iname', name: 'Name (no case)', type: 'text', placeholder: '*.TXT', conflicts_with: ['name'], group: 'Match' },
      { id: 'type', flag: '-type', name: 'Type', type: 'select', options: [{ value: '', label: 'Any' }, { value: 'f', label: 'File' }, { value: 'd', label: 'Directory' }, { value: 'l', label: 'Symlink' }], group: 'Match' },
      { id: 'size', flag: '-size', name: 'Size', type: 'text', placeholder: '+10M', description: '+10M, -1G, 100k', group: 'Match' },
      { id: 'mtime', flag: '-mtime', name: 'Modified Days', type: 'text', placeholder: '-7', description: '-N within N days, +N older', group: 'Match' },
      { id: 'maxdepth', flag: '-maxdepth', name: 'Max Depth', type: 'number', min: 0, placeholder: '3', group: 'Options' },
      { id: 'mindepth', flag: '-mindepth', name: 'Min Depth', type: 'number', min: 0, placeholder: '1', group: 'Options' },
      { id: 'exec', flag: '-exec', name: 'Execute', type: 'text', placeholder: 'rm {} \\;', danger: true, warning: '⚠️ Careful with destructive commands', group: 'Action' },
    ],
    examples: [
      { name: 'Large files', values: { path: '.', type: 'f', size: '+100M' }, output: 'find . -type f -size +100M' },
    ]
  },

  // ══════════════════════════════════════════
  // TEXT PROCESSING
  // ══════════════════════════════════════════
  'cat': {
    id: 'cat', name: 'cat', category: 'text', os: ['linux', 'macos'],
    description: 'Concatenate and display files', base: 'cat',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Source' },
      { id: 'number', flag: '-n', name: 'Line Numbers', type: 'checkbox', default: false, conflicts_with: ['number-nonblank'], group: 'Options' },
      { id: 'number-nonblank', flag: '-b', name: 'Number Non-blank', type: 'checkbox', default: false, conflicts_with: ['number'], group: 'Options' },
      { id: 'show-ends', flag: '-E', name: 'Show Ends', type: 'checkbox', default: false, description: 'Display $ at end of lines', group: 'Options' },
      { id: 'show-tabs', flag: '-T', name: 'Show Tabs', type: 'checkbox', default: false, description: 'Display TAB as ^I', group: 'Options' },
      { id: 'squeeze', flag: '-s', name: 'Squeeze Blank', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'less': {
    id: 'less', name: 'less', category: 'text', os: ['linux', 'macos'],
    description: 'View file with backward/forward scrolling', base: 'less',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Source' },
      { id: 'line-numbers', flag: '-N', name: 'Line Numbers', type: 'checkbox', default: false, group: 'Options' },
      { id: 'ignore-case', flag: '-i', name: 'Ignore Case', type: 'checkbox', default: false, description: 'Case-insensitive search', group: 'Options' },
      { id: 'raw-control', flag: '-R', name: 'Raw Control Chars', type: 'checkbox', default: false, description: 'Show ANSI colors', group: 'Options' },
      { id: 'squeeze', flag: '-s', name: 'Squeeze Blank', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'more': {
    id: 'more', name: 'more', category: 'text', os: ['linux', 'macos'],
    description: 'View file page by page (forward only)', base: 'more',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Source' },
      { id: 'lines', flag: '-n', name: 'Lines Per Page', type: 'number', min: 1, placeholder: '20', group: 'Options' },
      { id: 'start-line', flag: '+', name: 'Start Line', type: 'number', min: 1, placeholder: '10', group: 'Options' },
    ],
  },
  'head': {
    id: 'head', name: 'head', category: 'text', os: ['linux', 'macos'],
    description: 'Output the first part of files', base: 'head',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'lines', flag: '-n', name: 'Lines', type: 'number', min: 1, placeholder: '10', group: 'Options' },
      { id: 'bytes', flag: '-c', name: 'Bytes', type: 'number', min: 1, conflicts_with: ['lines'], group: 'Options' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, description: 'No file headers', group: 'Options' },
    ],
  },
  'tail': {
    id: 'tail', name: 'tail', category: 'text', os: ['linux', 'macos'],
    description: 'Output the last part of files', base: 'tail',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'lines', flag: '-n', name: 'Lines', type: 'number', min: 1, placeholder: '10', group: 'Options' },
      { id: 'bytes', flag: '-c', name: 'Bytes', type: 'number', min: 1, conflicts_with: ['lines'], group: 'Options' },
      { id: 'follow', flag: '-f', name: 'Follow', type: 'checkbox', default: false, description: 'Keep reading as file grows', group: 'Options' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Watch log', values: { file: '/var/log/syslog', follow: true }, output: 'tail -f /var/log/syslog' },
    ]
  },
  'nano': {
    id: 'nano', name: 'nano', category: 'text', os: ['linux', 'macos'],
    description: 'Simple terminal text editor', base: 'nano',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'line', flag: '+', name: 'Start Line', type: 'number', min: 1, placeholder: '10', description: 'Open at line number', group: 'Options' },
      { id: 'backup', flag: '-B', name: 'Backup', type: 'checkbox', default: false, description: 'Create backup before saving', group: 'Options' },
      { id: 'linenumbers', flag: '-l', name: 'Line Numbers', type: 'checkbox', default: false, group: 'Options' },
      { id: 'mouse', flag: '-m', name: 'Mouse Support', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'vim': {
    id: 'vim', name: 'vim', category: 'text', os: ['linux', 'macos'],
    description: 'Advanced modal text editor', base: 'vim',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'line', flag: '+', name: 'Start Line', type: 'number', min: 1, placeholder: '10', group: 'Options' },
      { id: 'readonly', flag: '-R', name: 'Read Only', type: 'checkbox', default: false, group: 'Options' },
      { id: 'diff', flag: '-d', name: 'Diff Mode', type: 'checkbox', default: false, description: 'Open in diff mode', group: 'Options' },
      { id: 'cmd', flag: '-c', name: 'Command', type: 'text', placeholder: ':set number', description: 'Execute command after opening', group: 'Options' },
    ],
  },
  'vi': {
    id: 'vi', name: 'vi', category: 'text', os: ['linux', 'macos'],
    description: 'Classic text editor', base: 'vi',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'readonly', flag: '-R', name: 'Read Only', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'echo': {
    id: 'echo', name: 'echo', category: 'text', os: ['linux', 'macos', 'windows'],
    description: 'Display text or write to output', base: 'echo',
    args: [
      { id: 'text', name: 'Text', type: 'text', positional: true, position: 1, required: true, placeholder: 'Hello World', group: 'Content' },
      { id: 'no-newline', flag: '-n', name: 'No Newline', type: 'checkbox', default: false, description: 'Do not append newline', group: 'Options' },
      { id: 'escape', flag: '-e', name: 'Enable Escapes', type: 'checkbox', default: false, description: 'Interpret \\n \\t etc.', group: 'Options' },
    ],
  },
  'grep': {
    id: 'grep', name: 'grep', category: 'text', os: ['linux', 'macos'],
    description: 'Search for patterns in text', base: 'grep',
    args: [
      { id: 'pattern', name: 'Pattern', type: 'text', positional: true, position: 1, required: true, placeholder: 'search term', group: 'Search' },
      { id: 'file', name: 'File', type: 'text', positional: true, position: 2, placeholder: 'file.txt', description: 'Optional when piping', group: 'Source' },
      { id: 'ignore-case', flag: '-i', name: 'Ignore Case', type: 'checkbox', default: false, group: 'Matching' },
      { id: 'invert', flag: '-v', name: 'Invert Match', type: 'checkbox', default: false, description: 'Show non-matching lines', group: 'Matching' },
      { id: 'word', flag: '-w', name: 'Whole Word', type: 'checkbox', default: false, group: 'Matching' },
      { id: 'regex', flag: '-E', name: 'Extended Regex', type: 'checkbox', default: false, group: 'Matching' },
      { id: 'fixed', flag: '-F', name: 'Fixed String', type: 'checkbox', default: false, description: 'Treat pattern as literal', conflicts_with: ['regex'], group: 'Matching' },
      { id: 'count', flag: '-c', name: 'Count Only', type: 'checkbox', default: false, conflicts_with: ['line-number', 'only-matching'], group: 'Output' },
      { id: 'line-number', flag: '-n', name: 'Line Numbers', type: 'checkbox', default: false, group: 'Output' },
      { id: 'only-matching', flag: '-o', name: 'Only Matching', type: 'checkbox', default: false, group: 'Output' },
      { id: 'context', flag: '-C', name: 'Context Lines', type: 'number', min: 0, placeholder: '3', group: 'Output' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, group: 'Files' },
      { id: 'include', flag: '--include', name: 'Include Files', type: 'text', placeholder: '*.js', depends_on: ['recursive'], group: 'Files' },
    ],
    examples: [
      { name: 'Case-insensitive search', values: { pattern: 'error', file: 'log.txt', 'ignore-case': true, 'line-number': true }, output: "grep -i -n 'error' log.txt" },
    ]
  },
  'awk': {
    id: 'awk', name: 'awk', category: 'text', os: ['linux', 'macos'],
    description: 'Pattern scanning and text processing', base: 'awk',
    args: [
      { id: 'program', name: 'Program', type: 'text', positional: true, position: 1, required: true, placeholder: '{print $1}', group: 'Program' },
      { id: 'file', name: 'File', type: 'text', positional: true, position: 2, placeholder: 'file.txt', group: 'Source' },
      { id: 'field-separator', flag: '-F', name: 'Field Separator', type: 'text', placeholder: ',', group: 'Options' },
      { id: 'var', flag: '-v', name: 'Variable', type: 'text', placeholder: 'name=value', group: 'Options' },
    ],
    examples: [
      { name: 'Print first column', values: { program: '{print $1}' }, output: "awk '{print $1}'" },
      { name: 'CSV field', values: { program: '{print $2}', 'field-separator': ',' }, output: "awk -F ',' '{print $2}'" },
    ]
  },
  'sed': {
    id: 'sed', name: 'sed', category: 'text', os: ['linux', 'macos'],
    description: 'Stream editor for text transformation', base: 'sed',
    args: [
      { id: 'expression', flag: '-e', name: 'Expression', type: 'text', required: true, placeholder: 's/old/new/g', group: 'Expression' },
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'in-place', flag: '-i', name: 'In-Place', type: 'checkbox', default: false, danger: true, warning: '⚠️ Modifies files directly!', group: 'Options' },
      { id: 'extended', flag: '-E', name: 'Extended Regex', type: 'checkbox', default: false, group: 'Options' },
      { id: 'quiet', flag: '-n', name: 'Quiet', type: 'checkbox', default: false, description: 'Suppress auto-printing', group: 'Options' },
    ],
    examples: [
      { name: 'Replace text', values: { expression: 's/foo/bar/g' }, output: "sed -e 's/foo/bar/g'" },
    ]
  },
  'cut': {
    id: 'cut', name: 'cut', category: 'text', os: ['linux', 'macos'],
    description: 'Remove sections from each line', base: 'cut',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'fields', flag: '-f', name: 'Fields', type: 'text', placeholder: '1,3', description: 'Select fields (1,3 or 1-3)', conflicts_with: ['characters', 'bytes-cut'], group: 'Selection' },
      { id: 'characters', flag: '-c', name: 'Characters', type: 'text', placeholder: '1-10', conflicts_with: ['fields', 'bytes-cut'], group: 'Selection' },
      { id: 'bytes-cut', flag: '-b', name: 'Bytes', type: 'text', placeholder: '1-10', conflicts_with: ['fields', 'characters'], group: 'Selection' },
      { id: 'delimiter', flag: '-d', name: 'Delimiter', type: 'text', placeholder: ',', description: 'Field delimiter (default TAB)', group: 'Options' },
      { id: 'complement', flag: '--complement', name: 'Complement', type: 'checkbox', default: false, description: 'Select all except specified', group: 'Options' },
    ],
    examples: [
      { name: 'CSV 2nd column', values: { fields: '2', delimiter: ',' }, output: "cut -f 2 -d ','" },
    ]
  },
  'sort': {
    id: 'sort', name: 'sort', category: 'text', os: ['linux', 'macos'],
    description: 'Sort lines of text', base: 'sort',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'reverse', flag: '-r', name: 'Reverse', type: 'checkbox', default: false, group: 'Order' },
      { id: 'numeric', flag: '-n', name: 'Numeric Sort', type: 'checkbox', default: false, group: 'Order' },
      { id: 'human-numeric', flag: '-h', name: 'Human Numeric', type: 'checkbox', default: false, description: 'Compare human-readable numbers (2K, 1G)', conflicts_with: ['numeric'], group: 'Order' },
      { id: 'unique', flag: '-u', name: 'Unique', type: 'checkbox', default: false, group: 'Options' },
      { id: 'ignore-case', flag: '-f', name: 'Ignore Case', type: 'checkbox', default: false, group: 'Options' },
      { id: 'key', flag: '-k', name: 'Sort Key', type: 'text', placeholder: '2', description: 'Sort by field number', group: 'Options' },
      { id: 'separator', flag: '-t', name: 'Field Separator', type: 'text', placeholder: ',', group: 'Options' },
    ],
  },
  'uniq': {
    id: 'uniq', name: 'uniq', category: 'text', os: ['linux', 'macos'],
    description: 'Report or omit repeated lines', base: 'uniq',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'count', flag: '-c', name: 'Count', type: 'checkbox', default: false, description: 'Prefix with occurrence count', group: 'Options' },
      { id: 'repeated', flag: '-d', name: 'Duplicates Only', type: 'checkbox', default: false, conflicts_with: ['unique-only'], group: 'Filter' },
      { id: 'unique-only', flag: '-u', name: 'Unique Only', type: 'checkbox', default: false, conflicts_with: ['repeated'], group: 'Filter' },
      { id: 'ignore-case', flag: '-i', name: 'Ignore Case', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'wc': {
    id: 'wc', name: 'wc', category: 'text', os: ['linux', 'macos'],
    description: 'Word, line, character, and byte count', base: 'wc',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, placeholder: 'file.txt', group: 'Source' },
      { id: 'lines', flag: '-l', name: 'Lines', type: 'checkbox', default: false, group: 'Output' },
      { id: 'words', flag: '-w', name: 'Words', type: 'checkbox', default: false, group: 'Output' },
      { id: 'chars', flag: '-c', name: 'Bytes', type: 'checkbox', default: false, group: 'Output' },
      { id: 'max-line', flag: '-L', name: 'Max Line Length', type: 'checkbox', default: false, group: 'Output' },
    ],
  },
  'tr': {
    id: 'tr', name: 'tr', category: 'text', os: ['linux', 'macos'],
    description: 'Translate or delete characters', base: 'tr',
    args: [
      { id: 'set1', name: 'Set 1', type: 'text', positional: true, position: 1, required: true, placeholder: 'a-z', description: 'Characters to translate from', group: 'Sets' },
      { id: 'set2', name: 'Set 2', type: 'text', positional: true, position: 2, placeholder: 'A-Z', description: 'Characters to translate to', group: 'Sets' },
      { id: 'delete', flag: '-d', name: 'Delete', type: 'checkbox', default: false, description: 'Delete characters in SET1', group: 'Options' },
      { id: 'squeeze', flag: '-s', name: 'Squeeze', type: 'checkbox', default: false, description: 'Squeeze repeated characters', group: 'Options' },
      { id: 'complement', flag: '-c', name: 'Complement', type: 'checkbox', default: false, description: 'Use complement of SET1', group: 'Options' },
    ],
    examples: [
      { name: 'Uppercase', values: { set1: 'a-z', set2: 'A-Z' }, output: "tr 'a-z' 'A-Z'" },
      { name: 'Delete digits', values: { set1: '0-9', delete: true }, output: "tr -d '0-9'" },
    ]
  },
  'diff': {
    id: 'diff', name: 'diff', category: 'text', os: ['linux', 'macos'],
    description: 'Compare files line by line', base: 'diff',
    args: [
      { id: 'file1', name: 'File 1', type: 'text', positional: true, position: 1, required: true, placeholder: 'old.txt', group: 'Files' },
      { id: 'file2', name: 'File 2', type: 'text', positional: true, position: 2, required: true, placeholder: 'new.txt', group: 'Files' },
      { id: 'unified', flag: '-u', name: 'Unified Format', type: 'checkbox', default: false, description: 'Output unified diff', group: 'Format' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, description: 'Compare directories', group: 'Options' },
      { id: 'ignore-case', flag: '-i', name: 'Ignore Case', type: 'checkbox', default: false, group: 'Options' },
      { id: 'ignore-space', flag: '-w', name: 'Ignore Whitespace', type: 'checkbox', default: false, group: 'Options' },
      { id: 'brief', flag: '-q', name: 'Brief', type: 'checkbox', default: false, description: 'Only report if different', group: 'Options' },
      { id: 'color', flag: '--color', name: 'Color', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'patch': {
    id: 'patch', name: 'patch', category: 'text', os: ['linux', 'macos'],
    description: 'Apply a diff/patch file', base: 'patch',
    args: [
      { id: 'patchfile', flag: '-i', name: 'Patch File', type: 'text', required: true, placeholder: 'changes.patch', group: 'Source' },
      { id: 'strip', flag: '-p', name: 'Strip Prefix', type: 'number', min: 0, placeholder: '1', description: 'Strip N leading path components', group: 'Options' },
      { id: 'reverse', flag: '-R', name: 'Reverse', type: 'checkbox', default: false, description: 'Reverse (unapply) the patch', group: 'Options' },
      { id: 'dry-run', flag: '--dry-run', name: 'Dry Run', type: 'checkbox', default: false, description: 'Test without applying', group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // PERMISSIONS
  // ══════════════════════════════════════════
  'chmod': {
    id: 'chmod', name: 'chmod', category: 'permissions', os: ['linux', 'macos'],
    description: 'Change file access permissions', base: 'chmod',
    args: [
      { id: 'mode', name: 'Mode', type: 'text', positional: true, position: 1, required: true, placeholder: '755', description: 'Permissions (755, u+x, a+r)', group: 'Permission' },
      { id: 'file', name: 'File/Directory', type: 'text', positional: true, position: 2, required: true, placeholder: 'file.sh', group: 'Target' },
      { id: 'recursive', flag: '-R', name: 'Recursive', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Make executable', values: { mode: '+x', file: 'script.sh' }, output: 'chmod +x script.sh' },
      { name: 'Set 755', values: { mode: '755', file: 'script.sh' }, output: 'chmod 755 script.sh' },
    ]
  },
  'chown': {
    id: 'chown', name: 'chown', category: 'permissions', os: ['linux', 'macos'],
    description: 'Change file owner and group', base: 'chown',
    args: [
      { id: 'owner', name: 'Owner[:Group]', type: 'text', positional: true, position: 1, required: true, placeholder: 'user:group', group: 'Owner' },
      { id: 'file', name: 'File', type: 'text', positional: true, position: 2, required: true, placeholder: 'file.txt', group: 'Target' },
      { id: 'recursive', flag: '-R', name: 'Recursive', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'chgrp': {
    id: 'chgrp', name: 'chgrp', category: 'permissions', os: ['linux', 'macos'],
    description: 'Change file group ownership', base: 'chgrp',
    args: [
      { id: 'group', name: 'Group', type: 'text', positional: true, position: 1, required: true, placeholder: 'www-data', group: 'Group' },
      { id: 'file', name: 'File', type: 'text', positional: true, position: 2, required: true, placeholder: 'file.txt', group: 'Target' },
      { id: 'recursive', flag: '-R', name: 'Recursive', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'umask': {
    id: 'umask', name: 'umask', category: 'permissions', os: ['linux', 'macos'],
    description: 'Set default file creation permissions', base: 'umask',
    args: [
      { id: 'mask', name: 'Mask', type: 'text', positional: true, position: 1, placeholder: '022', description: 'Permission mask (022 = files get 644)', group: 'Mask' },
      { id: 'symbolic', flag: '-S', name: 'Symbolic', type: 'checkbox', default: false, description: 'Show in symbolic form', group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // PROCESSES
  // ══════════════════════════════════════════
  'ps': {
    id: 'ps', name: 'ps', category: 'process', os: ['linux', 'macos'],
    description: 'Report a snapshot of current processes', base: 'ps',
    args: [
      { id: 'all', flag: '-e', name: 'All Processes', type: 'checkbox', default: false, description: 'Show all processes', group: 'Filter' },
      { id: 'full', flag: '-f', name: 'Full Format', type: 'checkbox', default: false, description: 'Full-format listing', group: 'Format' },
      { id: 'long', flag: '-l', name: 'Long Format', type: 'checkbox', default: false, group: 'Format' },
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'root', description: 'Show processes for user', group: 'Filter' },
      { id: 'tree', flag: '--forest', name: 'Tree View', type: 'checkbox', default: false, description: 'Show process tree', group: 'Format' },
      { id: 'sort', flag: '--sort', name: 'Sort By', type: 'text', placeholder: '-%mem', description: 'Sort by field (-%cpu, -%mem)', group: 'Options' },
    ],
    examples: [
      { name: 'All processes', values: { all: true, full: true }, output: 'ps -e -f' },
      { name: 'By memory', values: { all: true, sort: '-%mem' }, output: 'ps -e --sort -%mem' },
    ]
  },
  'top': {
    id: 'top', name: 'top', category: 'process', os: ['linux', 'macos'],
    description: 'Display and update sorted process info', base: 'top',
    args: [
      { id: 'batch', flag: '-b', name: 'Batch Mode', type: 'checkbox', default: false, description: 'Output for piping', group: 'Options' },
      { id: 'iterations', flag: '-n', name: 'Iterations', type: 'number', min: 1, placeholder: '1', description: 'Number of updates', group: 'Options' },
      { id: 'delay', flag: '-d', name: 'Delay', type: 'number', min: 0, placeholder: '3', description: 'Seconds between updates', group: 'Options' },
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'root', group: 'Filter' },
      { id: 'pid', flag: '-p', name: 'PID', type: 'text', placeholder: '1234', description: 'Monitor specific PID', group: 'Filter' },
    ],
  },
  'htop': {
    id: 'htop', name: 'htop', category: 'process', os: ['linux', 'macos'],
    description: 'Interactive process viewer', base: 'htop',
    args: [
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'root', description: 'Show only processes of user', group: 'Filter' },
      { id: 'pid', flag: '-p', name: 'PID', type: 'text', placeholder: '1234', group: 'Filter' },
      { id: 'sort', flag: '-s', name: 'Sort Column', type: 'text', placeholder: 'PERCENT_CPU', group: 'Options' },
      { id: 'tree', flag: '-t', name: 'Tree View', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'kill': {
    id: 'kill', name: 'kill', category: 'process', os: ['linux', 'macos'],
    description: 'Send signal to a process', base: 'kill', danger_level: 'caution',
    args: [
      { id: 'pid', name: 'PID', type: 'text', positional: true, position: 1, required: true, placeholder: '1234', group: 'Target' },
      { id: 'signal', flag: '-s', name: 'Signal', type: 'select', options: [
        { value: '', label: 'Default (TERM)' }, { value: 'HUP', label: 'HUP (1) - Hangup' },
        { value: 'INT', label: 'INT (2) - Interrupt' }, { value: 'KILL', label: 'KILL (9) - Force kill' },
        { value: 'TERM', label: 'TERM (15) - Terminate' }, { value: 'STOP', label: 'STOP (19) - Pause' },
        { value: 'CONT', label: 'CONT (18) - Continue' },
      ], group: 'Signal' },
    ],
    examples: [
      { name: 'Force kill', values: { pid: '1234', signal: 'KILL' }, output: 'kill -s KILL 1234' },
    ]
  },
  'pkill': {
    id: 'pkill', name: 'pkill', category: 'process', os: ['linux', 'macos'],
    description: 'Kill processes by name pattern', base: 'pkill', danger_level: 'caution',
    args: [
      { id: 'pattern', name: 'Name Pattern', type: 'text', positional: true, position: 1, required: true, placeholder: 'firefox', group: 'Target' },
      { id: 'signal', flag: '-', name: 'Signal', type: 'select', options: [
        { value: '', label: 'Default (TERM)' }, { value: '9', label: 'KILL (9)' }, { value: '15', label: 'TERM (15)' },
      ], group: 'Signal' },
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'root', group: 'Filter' },
      { id: 'exact', flag: '-x', name: 'Exact Match', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'pgrep': {
    id: 'pgrep', name: 'pgrep', category: 'process', os: ['linux', 'macos'],
    description: 'Find process IDs by name', base: 'pgrep',
    args: [
      { id: 'pattern', name: 'Name Pattern', type: 'text', positional: true, position: 1, required: true, placeholder: 'nginx', group: 'Search' },
      { id: 'list-name', flag: '-l', name: 'List Names', type: 'checkbox', default: false, description: 'Show PID and name', group: 'Output' },
      { id: 'list-full', flag: '-a', name: 'Full Command', type: 'checkbox', default: false, description: 'Show full command line', group: 'Output' },
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'root', group: 'Filter' },
      { id: 'exact', flag: '-x', name: 'Exact Match', type: 'checkbox', default: false, group: 'Options' },
      { id: 'count', flag: '-c', name: 'Count', type: 'checkbox', default: false, description: 'Show count only', group: 'Output' },
    ],
  },
  'nice': {
    id: 'nice', name: 'nice', category: 'process', os: ['linux', 'macos'],
    description: 'Run command with modified scheduling priority', base: 'nice',
    args: [
      { id: 'adjustment', flag: '-n', name: 'Priority', type: 'number', min: -20, max: 19, placeholder: '10', description: '-20 (highest) to 19 (lowest)', group: 'Priority' },
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 1, required: true, placeholder: 'make -j4', group: 'Command' },
    ],
  },
  'renice': {
    id: 'renice', name: 'renice', category: 'process', os: ['linux', 'macos'],
    description: 'Alter priority of a running process', base: 'renice',
    args: [
      { id: 'priority', name: 'Priority', type: 'number', positional: true, position: 1, required: true, min: -20, max: 19, placeholder: '10', group: 'Priority' },
      { id: 'pid', flag: '-p', name: 'PID', type: 'text', required: true, placeholder: '1234', group: 'Target' },
    ],
  },
  'bg': {
    id: 'bg', name: 'bg', category: 'process', os: ['linux', 'macos'],
    description: 'Resume suspended job in background', base: 'bg',
    args: [
      { id: 'job', name: 'Job Number', type: 'text', positional: true, position: 1, placeholder: '%1', description: 'Job number (e.g. %1)', group: 'Target' },
    ],
  },
  'fg': {
    id: 'fg', name: 'fg', category: 'process', os: ['linux', 'macos'],
    description: 'Bring background job to foreground', base: 'fg',
    args: [
      { id: 'job', name: 'Job Number', type: 'text', positional: true, position: 1, placeholder: '%1', group: 'Target' },
    ],
  },
  'jobs': {
    id: 'jobs', name: 'jobs', category: 'process', os: ['linux', 'macos'],
    description: 'List active jobs in the current shell', base: 'jobs',
    args: [
      { id: 'long', flag: '-l', name: 'Long Format', type: 'checkbox', default: false, description: 'List PIDs as well', group: 'Options' },
      { id: 'running', flag: '-r', name: 'Running Only', type: 'checkbox', default: false, conflicts_with: ['stopped'], group: 'Filter' },
      { id: 'stopped', flag: '-s', name: 'Stopped Only', type: 'checkbox', default: false, conflicts_with: ['running'], group: 'Filter' },
    ],
  },

  // ══════════════════════════════════════════
  // SYSTEM INFO
  // ══════════════════════════════════════════
  'uname': {
    id: 'uname', name: 'uname', category: 'system', os: ['linux', 'macos'],
    description: 'Print system information', base: 'uname',
    args: [
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, description: 'Print all information', group: 'Options' },
      { id: 'kernel', flag: '-s', name: 'Kernel Name', type: 'checkbox', default: false, group: 'Info' },
      { id: 'nodename', flag: '-n', name: 'Node Name', type: 'checkbox', default: false, group: 'Info' },
      { id: 'release', flag: '-r', name: 'Kernel Release', type: 'checkbox', default: false, group: 'Info' },
      { id: 'machine', flag: '-m', name: 'Machine', type: 'checkbox', default: false, group: 'Info' },
      { id: 'os', flag: '-o', name: 'OS Name', type: 'checkbox', default: false, group: 'Info' },
    ],
  },
  'uptime': {
    id: 'uptime', name: 'uptime', category: 'system', os: ['linux', 'macos'],
    description: 'Show how long system has been running', base: 'uptime',
    args: [
      { id: 'pretty', flag: '-p', name: 'Pretty', type: 'checkbox', default: false, description: 'Human-readable format', group: 'Options' },
      { id: 'since', flag: '-s', name: 'Since', type: 'checkbox', default: false, description: 'Show boot time', conflicts_with: ['pretty'], group: 'Options' },
    ],
  },
  'hostname': {
    id: 'hostname', name: 'hostname', category: 'system', os: ['linux', 'macos', 'windows'],
    description: 'Show or set system hostname', base: 'hostname',
    args: [
      { id: 'fqdn', flag: '-f', name: 'FQDN', type: 'checkbox', default: false, description: 'Fully qualified domain name', group: 'Options' },
      { id: 'ip', flag: '-I', name: 'IP Addresses', type: 'checkbox', default: false, description: 'Show all IP addresses', conflicts_with: ['fqdn'], group: 'Options' },
      { id: 'short', flag: '-s', name: 'Short', type: 'checkbox', default: false, description: 'Short hostname only', group: 'Options' },
    ],
  },
  'df': {
    id: 'df', name: 'df', category: 'system', os: ['linux', 'macos'],
    description: 'Report filesystem disk space usage', base: 'df',
    args: [
      { id: 'path', name: 'Path', type: 'text', positional: true, position: 1, placeholder: '/', group: 'Source' },
      { id: 'human', flag: '-h', name: 'Human Readable', type: 'checkbox', default: false, description: 'Show sizes as K, M, G', group: 'Format' },
      { id: 'total', flag: '--total', name: 'Total', type: 'checkbox', default: false, description: 'Show grand total', group: 'Options' },
      { id: 'type', flag: '-T', name: 'Show FS Type', type: 'checkbox', default: false, description: 'Print filesystem type', group: 'Format' },
      { id: 'inodes', flag: '-i', name: 'Inodes', type: 'checkbox', default: false, description: 'Show inode info instead', group: 'Options' },
    ],
    examples: [
      { name: 'Human readable', values: { human: true }, output: 'df -h' },
    ]
  },
  'du': {
    id: 'du', name: 'du', category: 'system', os: ['linux', 'macos'],
    description: 'Estimate file and directory space usage', base: 'du',
    args: [
      { id: 'path', name: 'Path', type: 'text', positional: true, position: 1, placeholder: '.', group: 'Source' },
      { id: 'human', flag: '-h', name: 'Human Readable', type: 'checkbox', default: false, group: 'Format' },
      { id: 'summary', flag: '-s', name: 'Summary', type: 'checkbox', default: false, description: 'Total only', group: 'Options' },
      { id: 'max-depth', flag: '--max-depth', name: 'Max Depth', type: 'number', min: 0, placeholder: '1', group: 'Options' },
      { id: 'all', flag: '-a', name: 'All Files', type: 'checkbox', default: false, description: 'Include files not just dirs', group: 'Options' },
      { id: 'total', flag: '-c', name: 'Grand Total', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Top-level sizes', values: { human: true, 'max-depth': 1 }, output: 'du -h --max-depth 1' },
    ]
  },
  'free': {
    id: 'free', name: 'free', category: 'system', os: ['linux'],
    description: 'Display free and used memory', base: 'free',
    args: [
      { id: 'human', flag: '-h', name: 'Human Readable', type: 'checkbox', default: false, group: 'Format' },
      { id: 'total', flag: '-t', name: 'Show Total', type: 'checkbox', default: false, group: 'Options' },
      { id: 'wide', flag: '-w', name: 'Wide Output', type: 'checkbox', default: false, group: 'Format' },
      { id: 'seconds', flag: '-s', name: 'Repeat (seconds)', type: 'number', min: 1, placeholder: '2', description: 'Repeat every N seconds', group: 'Options' },
    ],
  },
  'lsblk': {
    id: 'lsblk', name: 'lsblk', category: 'system', os: ['linux'],
    description: 'List information about block devices', base: 'lsblk',
    args: [
      { id: 'all', flag: '-a', name: 'All Devices', type: 'checkbox', default: false, description: 'Include empty devices', group: 'Options' },
      { id: 'filesystems', flag: '-f', name: 'Filesystems', type: 'checkbox', default: false, description: 'Show filesystem info', group: 'Options' },
      { id: 'paths', flag: '-p', name: 'Full Paths', type: 'checkbox', default: false, group: 'Format' },
      { id: 'output', flag: '-o', name: 'Columns', type: 'text', placeholder: 'NAME,SIZE,TYPE,MOUNTPOINT', description: 'Specify columns', group: 'Format' },
    ],
  },
  'lscpu': {
    id: 'lscpu', name: 'lscpu', category: 'system', os: ['linux'],
    description: 'Display CPU architecture information', base: 'lscpu',
    args: [
      { id: 'extended', flag: '-e', name: 'Extended', type: 'checkbox', default: false, description: 'Extended output', group: 'Options' },
      { id: 'json', flag: '-J', name: 'JSON Output', type: 'checkbox', default: false, group: 'Format' },
    ],
  },
  'vmstat': {
    id: 'vmstat', name: 'vmstat', category: 'system', os: ['linux'],
    description: 'Report virtual memory statistics', base: 'vmstat',
    args: [
      { id: 'delay', name: 'Delay', type: 'number', positional: true, position: 1, min: 1, placeholder: '1', description: 'Seconds between updates', group: 'Options' },
      { id: 'count', name: 'Count', type: 'number', positional: true, position: 2, min: 1, placeholder: '5', description: 'Number of updates', group: 'Options' },
      { id: 'wide', flag: '-w', name: 'Wide', type: 'checkbox', default: false, group: 'Format' },
      { id: 'active', flag: '-a', name: 'Active/Inactive', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'iostat': {
    id: 'iostat', name: 'iostat', category: 'system', os: ['linux'],
    description: 'Report I/O and CPU statistics', base: 'iostat',
    args: [
      { id: 'delay', name: 'Delay', type: 'number', positional: true, position: 1, min: 1, placeholder: '1', group: 'Options' },
      { id: 'count', name: 'Count', type: 'number', positional: true, position: 2, min: 1, placeholder: '5', group: 'Options' },
      { id: 'extended', flag: '-x', name: 'Extended', type: 'checkbox', default: false, description: 'Extended statistics', group: 'Options' },
      { id: 'human', flag: '-h', name: 'Human Readable', type: 'checkbox', default: false, group: 'Format' },
    ],
  },

  // ══════════════════════════════════════════
  // USER MANAGEMENT
  // ══════════════════════════════════════════
  'useradd': {
    id: 'useradd', name: 'useradd', category: 'users', os: ['linux'],
    description: 'Create a new user account', base: 'sudo useradd', danger_level: 'caution',
    args: [
      { id: 'username', name: 'Username', type: 'text', positional: true, position: 1, required: true, placeholder: 'newuser', group: 'User' },
      { id: 'home', flag: '-m', name: 'Create Home', type: 'checkbox', default: false, description: 'Create home directory', group: 'Options' },
      { id: 'shell', flag: '-s', name: 'Shell', type: 'text', placeholder: '/bin/bash', group: 'Options' },
      { id: 'groups', flag: '-G', name: 'Groups', type: 'text', placeholder: 'sudo,docker', description: 'Comma-separated groups', group: 'Options' },
      { id: 'comment', flag: '-c', name: 'Comment/Name', type: 'text', placeholder: 'John Doe', group: 'Options' },
      { id: 'uid', flag: '-u', name: 'UID', type: 'number', min: 1000, placeholder: '1001', group: 'Options' },
    ],
  },
  'usermod': {
    id: 'usermod', name: 'usermod', category: 'users', os: ['linux'],
    description: 'Modify a user account', base: 'sudo usermod', danger_level: 'caution',
    args: [
      { id: 'username', name: 'Username', type: 'text', positional: true, position: 1, required: true, placeholder: 'user', group: 'User' },
      { id: 'add-groups', flag: '-aG', name: 'Add to Groups', type: 'text', placeholder: 'docker,sudo', description: 'Append to supplementary groups', group: 'Options' },
      { id: 'shell', flag: '-s', name: 'Shell', type: 'text', placeholder: '/bin/zsh', group: 'Options' },
      { id: 'login', flag: '-l', name: 'New Username', type: 'text', placeholder: 'newname', group: 'Options' },
      { id: 'lock', flag: '-L', name: 'Lock Account', type: 'checkbox', default: false, conflicts_with: ['unlock'], group: 'Security' },
      { id: 'unlock', flag: '-U', name: 'Unlock Account', type: 'checkbox', default: false, conflicts_with: ['lock'], group: 'Security' },
    ],
    examples: [
      { name: 'Add to docker', values: { username: 'myuser', 'add-groups': 'docker' }, output: 'sudo usermod -aG docker myuser' },
    ]
  },
  'userdel': {
    id: 'userdel', name: 'userdel', category: 'users', os: ['linux'],
    description: 'Delete a user account', base: 'sudo userdel', danger_level: 'dangerous',
    args: [
      { id: 'username', name: 'Username', type: 'text', positional: true, position: 1, required: true, placeholder: 'olduser', group: 'User' },
      { id: 'remove-home', flag: '-r', name: 'Remove Home', type: 'checkbox', default: false, danger: true, warning: '⚠️ Deletes home directory!', group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, group: 'Options' },
    ],
  },
  'groupadd': {
    id: 'groupadd', name: 'groupadd', category: 'users', os: ['linux'],
    description: 'Create a new group', base: 'sudo groupadd',
    args: [
      { id: 'group', name: 'Group Name', type: 'text', positional: true, position: 1, required: true, placeholder: 'developers', group: 'Group' },
      { id: 'gid', flag: '-g', name: 'GID', type: 'number', min: 1000, placeholder: '1001', group: 'Options' },
      { id: 'system', flag: '-r', name: 'System Group', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'passwd': {
    id: 'passwd', name: 'passwd', category: 'users', os: ['linux', 'macos'],
    description: 'Change user password', base: 'passwd',
    args: [
      { id: 'username', name: 'Username', type: 'text', positional: true, position: 1, placeholder: 'user', description: 'Leave empty for current user', group: 'User' },
      { id: 'lock', flag: '-l', name: 'Lock', type: 'checkbox', default: false, description: 'Lock the account', conflicts_with: ['unlock'], group: 'Options' },
      { id: 'unlock', flag: '-u', name: 'Unlock', type: 'checkbox', default: false, conflicts_with: ['lock'], group: 'Options' },
      { id: 'delete', flag: '-d', name: 'Delete Password', type: 'checkbox', default: false, danger: true, warning: '⚠️ Allows login without password!', group: 'Options' },
      { id: 'expire', flag: '-e', name: 'Expire', type: 'checkbox', default: false, description: 'Force password change on next login', group: 'Options' },
    ],
  },
  'su': {
    id: 'su', name: 'su', category: 'users', os: ['linux', 'macos'],
    description: 'Switch to another user', base: 'su',
    args: [
      { id: 'user', name: 'User', type: 'text', positional: true, position: 1, placeholder: 'root', description: 'Target user (default: root)', group: 'User' },
      { id: 'login', flag: '-', name: 'Login Shell', type: 'checkbox', default: false, description: 'Start a login shell', group: 'Options' },
      { id: 'command', flag: '-c', name: 'Command', type: 'text', placeholder: 'whoami', description: 'Run single command as user', group: 'Options' },
    ],
  },
  'sudo': {
    id: 'sudo', name: 'sudo', category: 'users', os: ['linux', 'macos'],
    description: 'Execute command as another user (default: root)', base: 'sudo',
    args: [
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 1, required: true, placeholder: 'apt update', group: 'Command' },
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'www-data', description: 'Run as specified user', group: 'Options' },
      { id: 'interactive', flag: '-i', name: 'Login Shell', type: 'checkbox', default: false, description: 'Open root login shell', group: 'Options' },
      { id: 'env', flag: '-E', name: 'Preserve Env', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'id': {
    id: 'id', name: 'id', category: 'users', os: ['linux', 'macos'],
    description: 'Print user and group IDs', base: 'id',
    args: [
      { id: 'user', name: 'User', type: 'text', positional: true, position: 1, placeholder: 'root', description: 'User to check (default: current)', group: 'User' },
      { id: 'group', flag: '-g', name: 'Group Only', type: 'checkbox', default: false, group: 'Options' },
      { id: 'groups', flag: '-G', name: 'All Groups', type: 'checkbox', default: false, group: 'Options' },
      { id: 'name', flag: '-n', name: 'Names', type: 'checkbox', default: false, description: 'Show names instead of numbers', group: 'Options' },
    ],
  },
  'who': {
    id: 'who', name: 'who', category: 'users', os: ['linux', 'macos'],
    description: 'Show who is logged in', base: 'who',
    args: [
      { id: 'heading', flag: '-H', name: 'Heading', type: 'checkbox', default: false, description: 'Print column headers', group: 'Options' },
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, description: 'Show all info', group: 'Options' },
      { id: 'boot', flag: '-b', name: 'Boot Time', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'w': {
    id: 'w', name: 'w', category: 'users', os: ['linux', 'macos'],
    description: 'Show who is logged in and what they are doing', base: 'w',
    args: [
      { id: 'user', name: 'User', type: 'text', positional: true, position: 1, placeholder: 'root', description: 'Show info for specific user', group: 'Filter' },
      { id: 'no-header', flag: '-h', name: 'No Header', type: 'checkbox', default: false, group: 'Options' },
      { id: 'short', flag: '-s', name: 'Short Format', type: 'checkbox', default: false, group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // NETWORKING
  // ══════════════════════════════════════════
  'ip': {
    id: 'ip', name: 'ip', category: 'network', os: ['linux'],
    description: 'Show/manipulate routing, devices, tunnels', base: 'ip',
    args: [
      { id: 'object', name: 'Object', type: 'select', positional: true, position: 1, options: [
        { value: 'addr', label: 'Address' }, { value: 'link', label: 'Link' }, { value: 'route', label: 'Route' }, { value: 'neigh', label: 'Neighbor' },
      ], group: 'Object' },
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 2, options: [
        { value: 'show', label: 'Show' }, { value: 'add', label: 'Add' }, { value: 'del', label: 'Delete' },
      ], group: 'Action' },
      { id: 'brief', flag: '-br', name: 'Brief', type: 'checkbox', default: false, group: 'Format' },
      { id: 'color', flag: '-c', name: 'Color', type: 'checkbox', default: false, group: 'Format' },
    ],
    examples: [
      { name: 'Show addresses', values: { object: 'addr', action: 'show' }, output: 'ip addr show' },
    ]
  },
  'ifconfig': {
    id: 'ifconfig', name: 'ifconfig', category: 'network', os: ['linux', 'macos'],
    description: 'Configure network interfaces', base: 'ifconfig',
    args: [
      { id: 'interface', name: 'Interface', type: 'text', positional: true, position: 1, placeholder: 'eth0', group: 'Interface' },
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, description: 'Show all interfaces', group: 'Options' },
    ],
  },
  'ping': {
    id: 'ping', name: 'ping', category: 'network', os: ['linux', 'macos', 'windows'],
    description: 'Send ICMP echo requests to a host', base: 'ping',
    args: [
      { id: 'host', name: 'Host', type: 'text', positional: true, position: 1, required: true, placeholder: 'google.com', group: 'Target' },
      { id: 'count', flag: '-c', name: 'Count', type: 'number', min: 1, placeholder: '4', description: 'Number of packets', group: 'Options' },
      { id: 'interval', flag: '-i', name: 'Interval', type: 'number', min: 0, placeholder: '1', description: 'Seconds between packets', group: 'Options' },
      { id: 'timeout', flag: '-W', name: 'Timeout', type: 'number', min: 1, placeholder: '5', description: 'Seconds to wait for reply', group: 'Options' },
      { id: 'ttl', flag: '-t', name: 'TTL', type: 'number', min: 1, max: 255, placeholder: '64', group: 'Options' },
    ],
    examples: [
      { name: 'Quick test', values: { host: '8.8.8.8', count: 4 }, output: 'ping -c 4 8.8.8.8' },
    ]
  },
  'traceroute': {
    id: 'traceroute', name: 'traceroute', category: 'network', os: ['linux', 'macos'],
    description: 'Trace the route packets take to a host', base: 'traceroute',
    args: [
      { id: 'host', name: 'Host', type: 'text', positional: true, position: 1, required: true, placeholder: 'google.com', group: 'Target' },
      { id: 'max-hops', flag: '-m', name: 'Max Hops', type: 'number', min: 1, max: 255, placeholder: '30', group: 'Options' },
      { id: 'numeric', flag: '-n', name: 'Numeric Only', type: 'checkbox', default: false, description: 'No DNS lookups', group: 'Options' },
      { id: 'wait', flag: '-w', name: 'Wait (seconds)', type: 'number', min: 1, placeholder: '5', group: 'Options' },
    ],
  },
  'netstat': {
    id: 'netstat', name: 'netstat', category: 'network', os: ['linux', 'macos', 'windows'],
    description: 'Network connections, routing tables, statistics', base: 'netstat',
    args: [
      { id: 'all', flag: '-a', name: 'All Connections', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'listening', flag: '-l', name: 'Listening Only', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'numeric', flag: '-n', name: 'Numeric', type: 'checkbox', default: false, description: 'Show numbers instead of names', group: 'Options' },
      { id: 'tcp', flag: '-t', name: 'TCP Only', type: 'checkbox', default: false, conflicts_with: ['udp'], group: 'Protocol' },
      { id: 'udp', flag: '-u', name: 'UDP Only', type: 'checkbox', default: false, conflicts_with: ['tcp'], group: 'Protocol' },
      { id: 'programs', flag: '-p', name: 'Show Programs', type: 'checkbox', default: false, description: 'Show PID/program name', group: 'Options' },
    ],
    examples: [
      { name: 'Listening ports', values: { listening: true, numeric: true, tcp: true, programs: true }, output: 'netstat -l -n -t -p' },
    ]
  },
  'ss': {
    id: 'ss', name: 'ss', category: 'network', os: ['linux'],
    description: 'Socket statistics (modern netstat)', base: 'ss',
    args: [
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'listening', flag: '-l', name: 'Listening', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'numeric', flag: '-n', name: 'Numeric', type: 'checkbox', default: false, group: 'Options' },
      { id: 'tcp', flag: '-t', name: 'TCP', type: 'checkbox', default: false, group: 'Protocol' },
      { id: 'udp', flag: '-u', name: 'UDP', type: 'checkbox', default: false, group: 'Protocol' },
      { id: 'processes', flag: '-p', name: 'Show Processes', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Listening TCP', values: { listening: true, numeric: true, tcp: true, processes: true }, output: 'ss -l -n -t -p' },
    ]
  },
  'curl': {
    id: 'curl', name: 'curl', category: 'network', os: ['linux', 'macos', 'windows'],
    description: 'Transfer data from or to a server', base: 'curl',
    args: [
      { id: 'url', name: 'URL', type: 'text', positional: true, position: 1, required: true, placeholder: 'https://api.example.com', group: 'Target' },
      { id: 'output', flag: '-o', name: 'Output File', type: 'text', placeholder: 'file.html', group: 'Output' },
      { id: 'remote-name', flag: '-O', name: 'Remote Name', type: 'checkbox', default: false, description: 'Save with remote filename', conflicts_with: ['output'], group: 'Output' },
      { id: 'method', flag: '-X', name: 'Method', type: 'select', options: [
        { value: '', label: 'GET (default)' }, { value: 'POST', label: 'POST' }, { value: 'PUT', label: 'PUT' }, { value: 'DELETE', label: 'DELETE' }, { value: 'PATCH', label: 'PATCH' },
      ], group: 'Request' },
      { id: 'data', flag: '-d', name: 'Data', type: 'text', placeholder: '{"key":"value"}', description: 'Request body', group: 'Request' },
      { id: 'header', flag: '-H', name: 'Header', type: 'text', placeholder: 'Content-Type: application/json', group: 'Request' },
      { id: 'follow', flag: '-L', name: 'Follow Redirects', type: 'checkbox', default: false, group: 'Options' },
      { id: 'silent', flag: '-s', name: 'Silent', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'insecure', flag: '-k', name: 'Insecure', type: 'checkbox', default: false, danger: true, description: 'Skip SSL verification', warning: '⚠️ Insecure!', group: 'Options' },
      { id: 'user', flag: '-u', name: 'Auth (user:pass)', type: 'text', placeholder: 'user:pass', group: 'Auth' },
    ],
    examples: [
      { name: 'JSON POST', values: { url: 'https://api.example.com/data', method: 'POST', data: '{"name":"test"}', header: 'Content-Type: application/json' }, output: "curl -X POST -d '{\"name\":\"test\"}' -H 'Content-Type: application/json' https://api.example.com/data" },
    ]
  },
  'wget': {
    id: 'wget', name: 'wget', category: 'network', os: ['linux', 'macos'],
    description: 'Download files from the web', base: 'wget',
    args: [
      { id: 'url', name: 'URL', type: 'text', positional: true, position: 1, required: true, placeholder: 'https://example.com/file.zip', group: 'Target' },
      { id: 'output', flag: '-O', name: 'Output File', type: 'text', placeholder: 'download.zip', group: 'Output' },
      { id: 'continue', flag: '-c', name: 'Continue', type: 'checkbox', default: false, description: 'Resume partial download', group: 'Options' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, group: 'Options' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, description: 'Download recursively', group: 'Options' },
      { id: 'no-clobber', flag: '-nc', name: 'No Clobber', type: 'checkbox', default: false, description: "Don't overwrite existing", group: 'Options' },
      { id: 'limit-rate', flag: '--limit-rate', name: 'Limit Rate', type: 'text', placeholder: '1m', description: 'Download speed limit (e.g. 1m)', group: 'Options' },
    ],
  },
  'ssh': {
    id: 'ssh', name: 'ssh', category: 'network', os: ['linux', 'macos', 'windows'],
    description: 'Secure shell remote connection', base: 'ssh',
    args: [
      { id: 'destination', name: 'User@Host', type: 'text', positional: true, position: 1, required: true, placeholder: 'user@hostname', group: 'Target' },
      { id: 'port', flag: '-p', name: 'Port', type: 'number', min: 1, max: 65535, placeholder: '22', group: 'Connection' },
      { id: 'identity', flag: '-i', name: 'Key File', type: 'text', placeholder: '~/.ssh/id_rsa', description: 'Private key file', group: 'Auth' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'forward-x', flag: '-X', name: 'X11 Forward', type: 'checkbox', default: false, group: 'Options' },
      { id: 'tunnel-local', flag: '-L', name: 'Local Tunnel', type: 'text', placeholder: '8080:localhost:80', description: 'Local port forwarding', group: 'Tunneling' },
      { id: 'tunnel-remote', flag: '-R', name: 'Remote Tunnel', type: 'text', placeholder: '8080:localhost:80', description: 'Remote port forwarding', group: 'Tunneling' },
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 2, placeholder: 'ls -la', description: 'Command to run remotely', group: 'Command' },
    ],
    examples: [
      { name: 'SSH with key', values: { destination: 'deploy@server.com', identity: '~/.ssh/deploy_key', port: 22 }, output: 'ssh -p 22 -i ~/.ssh/deploy_key deploy@server.com' },
    ]
  },
  'scp': {
    id: 'scp', name: 'scp', category: 'network', os: ['linux', 'macos'],
    description: 'Secure copy files over SSH', base: 'scp',
    args: [
      { id: 'source', name: 'Source', type: 'text', positional: true, position: 1, required: true, placeholder: 'user@host:/path/file', group: 'Paths' },
      { id: 'destination', name: 'Destination', type: 'text', positional: true, position: 2, required: true, placeholder: './local-file', group: 'Paths' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, description: 'Copy directories', group: 'Options' },
      { id: 'port', flag: '-P', name: 'Port', type: 'number', min: 1, max: 65535, placeholder: '22', group: 'Connection' },
      { id: 'identity', flag: '-i', name: 'Key File', type: 'text', placeholder: '~/.ssh/id_rsa', group: 'Auth' },
      { id: 'compress', flag: '-C', name: 'Compress', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'ftp': {
    id: 'ftp', name: 'ftp', category: 'network', os: ['linux', 'macos', 'windows'],
    description: 'File Transfer Protocol client', base: 'ftp',
    args: [
      { id: 'host', name: 'Host', type: 'text', positional: true, position: 1, required: true, placeholder: 'ftp.example.com', group: 'Target' },
      { id: 'port', flag: '-p', name: 'Port', type: 'number', min: 1, max: 65535, placeholder: '21', group: 'Connection' },
      { id: 'passive', flag: '-p', name: 'Passive Mode', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'host': {
    id: 'host', name: 'host', category: 'network', os: ['linux', 'macos'],
    description: 'DNS lookup utility', base: 'host',
    args: [
      { id: 'name', name: 'Hostname', type: 'text', positional: true, position: 1, required: true, placeholder: 'google.com', group: 'Target' },
      { id: 'server', name: 'DNS Server', type: 'text', positional: true, position: 2, placeholder: '8.8.8.8', group: 'Server' },
      { id: 'type', flag: '-t', name: 'Record Type', type: 'select', options: [
        { value: '', label: 'Default' }, { value: 'A', label: 'A' }, { value: 'AAAA', label: 'AAAA' }, { value: 'MX', label: 'MX' }, { value: 'NS', label: 'NS' }, { value: 'TXT', label: 'TXT' }, { value: 'CNAME', label: 'CNAME' },
      ], group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'nslookup': {
    id: 'nslookup', name: 'nslookup', category: 'network', os: ['linux', 'macos', 'windows'],
    description: 'Query DNS servers', base: 'nslookup',
    args: [
      { id: 'name', name: 'Hostname', type: 'text', positional: true, position: 1, required: true, placeholder: 'google.com', group: 'Target' },
      { id: 'server', name: 'DNS Server', type: 'text', positional: true, position: 2, placeholder: '8.8.8.8', group: 'Server' },
      { id: 'type', flag: '-type=', name: 'Record Type', type: 'select', options: [
        { value: '', label: 'Default' }, { value: 'A', label: 'A' }, { value: 'MX', label: 'MX' }, { value: 'NS', label: 'NS' }, { value: 'TXT', label: 'TXT' },
      ], group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // PACKAGE MANAGEMENT
  // ══════════════════════════════════════════
  'apt': {
    id: 'apt', name: 'apt', category: 'packages', os: ['linux'],
    description: 'Package manager (Debian/Ubuntu)', base: 'sudo apt',
    args: [
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 1, required: true, options: [
        { value: 'update', label: 'update' }, { value: 'upgrade', label: 'upgrade' }, { value: 'install', label: 'install' },
        { value: 'remove', label: 'remove' }, { value: 'purge', label: 'purge' }, { value: 'autoremove', label: 'autoremove' },
        { value: 'search', label: 'search' }, { value: 'list', label: 'list' }, { value: 'show', label: 'show' },
      ], group: 'Action' },
      { id: 'package', name: 'Package', type: 'text', positional: true, position: 2, placeholder: 'package-name', group: 'Package' },
      { id: 'yes', flag: '-y', name: 'Auto Yes', type: 'checkbox', default: false, description: 'Skip confirmation', group: 'Options' },
      { id: 'fix-broken', flag: '--fix-broken', name: 'Fix Broken', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Install package', values: { action: 'install', package: 'nginx', yes: true }, output: 'sudo apt install -y nginx' },
      { name: 'Update all', values: { action: 'update' }, output: 'sudo apt update' },
    ]
  },
  'apt-get': {
    id: 'apt-get', name: 'apt-get', category: 'packages', os: ['linux'],
    description: 'APT package handling utility', base: 'sudo apt-get',
    args: [
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 1, required: true, options: [
        { value: 'update', label: 'update' }, { value: 'upgrade', label: 'upgrade' }, { value: 'install', label: 'install' },
        { value: 'remove', label: 'remove' }, { value: 'purge', label: 'purge' }, { value: 'autoremove', label: 'autoremove' },
        { value: 'dist-upgrade', label: 'dist-upgrade' },
      ], group: 'Action' },
      { id: 'package', name: 'Package', type: 'text', positional: true, position: 2, placeholder: 'package-name', group: 'Package' },
      { id: 'yes', flag: '-y', name: 'Auto Yes', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'dpkg': {
    id: 'dpkg', name: 'dpkg', category: 'packages', os: ['linux'],
    description: 'Debian package manager (low-level)', base: 'sudo dpkg',
    args: [
      { id: 'install', flag: '-i', name: 'Install', type: 'text', placeholder: 'package.deb', description: 'Install .deb file', conflicts_with: ['remove', 'list-installed'], group: 'Action' },
      { id: 'remove', flag: '-r', name: 'Remove', type: 'text', placeholder: 'package-name', conflicts_with: ['install', 'list-installed'], group: 'Action' },
      { id: 'list-installed', flag: '-l', name: 'List Installed', type: 'checkbox', default: false, conflicts_with: ['install', 'remove'], group: 'Action' },
      { id: 'status', flag: '-s', name: 'Status', type: 'text', placeholder: 'package-name', description: 'Show package status', group: 'Query' },
    ],
  },
  'dnf': {
    id: 'dnf', name: 'dnf', category: 'packages', os: ['linux'],
    description: 'Package manager (Fedora/RHEL)', base: 'sudo dnf',
    args: [
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 1, required: true, options: [
        { value: 'install', label: 'install' }, { value: 'remove', label: 'remove' }, { value: 'update', label: 'update' },
        { value: 'search', label: 'search' }, { value: 'info', label: 'info' }, { value: 'list', label: 'list' },
      ], group: 'Action' },
      { id: 'package', name: 'Package', type: 'text', positional: true, position: 2, placeholder: 'package-name', group: 'Package' },
      { id: 'yes', flag: '-y', name: 'Auto Yes', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'yum': {
    id: 'yum', name: 'yum', category: 'packages', os: ['linux'],
    description: 'Package manager (older RHEL/CentOS)', base: 'sudo yum',
    args: [
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 1, required: true, options: [
        { value: 'install', label: 'install' }, { value: 'remove', label: 'remove' }, { value: 'update', label: 'update' },
        { value: 'search', label: 'search' }, { value: 'info', label: 'info' }, { value: 'list', label: 'list' },
      ], group: 'Action' },
      { id: 'package', name: 'Package', type: 'text', positional: true, position: 2, placeholder: 'package-name', group: 'Package' },
      { id: 'yes', flag: '-y', name: 'Auto Yes', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'rpm': {
    id: 'rpm', name: 'rpm', category: 'packages', os: ['linux'],
    description: 'RPM package manager', base: 'sudo rpm',
    args: [
      { id: 'install', flag: '-ivh', name: 'Install', type: 'text', placeholder: 'package.rpm', conflicts_with: ['query', 'erase'], group: 'Action' },
      { id: 'query', flag: '-q', name: 'Query', type: 'text', placeholder: 'package-name', conflicts_with: ['install', 'erase'], group: 'Action' },
      { id: 'erase', flag: '-e', name: 'Erase', type: 'text', placeholder: 'package-name', danger: true, conflicts_with: ['install', 'query'], group: 'Action' },
      { id: 'list-all', flag: '-qa', name: 'List All', type: 'checkbox', default: false, group: 'Query' },
    ],
  },
  'pacman': {
    id: 'pacman', name: 'pacman', category: 'packages', os: ['linux'],
    description: 'Package manager (Arch Linux)', base: 'sudo pacman',
    args: [
      { id: 'sync', flag: '-S', name: 'Install/Sync', type: 'text', placeholder: 'package-name', conflicts_with: ['remove', 'query'], group: 'Action' },
      { id: 'remove', flag: '-R', name: 'Remove', type: 'text', placeholder: 'package-name', danger: true, conflicts_with: ['sync', 'query'], group: 'Action' },
      { id: 'query', flag: '-Q', name: 'Query Local', type: 'checkbox', default: false, conflicts_with: ['sync', 'remove'], group: 'Action' },
      { id: 'update', flag: '-y', name: 'Refresh DB', type: 'checkbox', default: false, group: 'Options' },
      { id: 'upgrade', flag: '-u', name: 'Upgrade All', type: 'checkbox', default: false, group: 'Options' },
      { id: 'noconfirm', flag: '--noconfirm', name: 'No Confirm', type: 'checkbox', default: false, group: 'Options' },
    ],
    examples: [
      { name: 'Full system update', values: { sync: '', update: true, upgrade: true }, output: 'sudo pacman -Syu' },
    ]
  },
  'zypper': {
    id: 'zypper', name: 'zypper', category: 'packages', os: ['linux'],
    description: 'Package manager (openSUSE)', base: 'sudo zypper',
    args: [
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 1, required: true, options: [
        { value: 'install', label: 'install' }, { value: 'remove', label: 'remove' }, { value: 'update', label: 'update' },
        { value: 'search', label: 'search' }, { value: 'refresh', label: 'refresh' },
      ], group: 'Action' },
      { id: 'package', name: 'Package', type: 'text', positional: true, position: 2, placeholder: 'package-name', group: 'Package' },
      { id: 'non-interactive', flag: '-n', name: 'Non-Interactive', type: 'checkbox', default: false, group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // DISK MANAGEMENT
  // ══════════════════════════════════════════
  'fdisk': {
    id: 'fdisk', name: 'fdisk', category: 'disk', os: ['linux'],
    description: 'Partition table manipulator', base: 'sudo fdisk', danger_level: 'dangerous',
    args: [
      { id: 'device', name: 'Device', type: 'text', positional: true, position: 1, placeholder: '/dev/sda', group: 'Device' },
      { id: 'list', flag: '-l', name: 'List Partitions', type: 'checkbox', default: false, description: 'List partition tables', group: 'Options' },
    ],
  },
  'parted': {
    id: 'parted', name: 'parted', category: 'disk', os: ['linux'],
    description: 'Partition manipulation program', base: 'sudo parted', danger_level: 'dangerous',
    args: [
      { id: 'device', name: 'Device', type: 'text', positional: true, position: 1, placeholder: '/dev/sda', group: 'Device' },
      { id: 'list', flag: '-l', name: 'List All', type: 'checkbox', default: false, group: 'Options' },
      { id: 'script', flag: '-s', name: 'Script Mode', type: 'checkbox', default: false, description: 'No user prompts', group: 'Options' },
    ],
  },
  'mkfs': {
    id: 'mkfs', name: 'mkfs', category: 'disk', os: ['linux'],
    description: 'Build a Linux filesystem', base: 'sudo mkfs', danger_level: 'dangerous',
    args: [
      { id: 'type', flag: '-t', name: 'FS Type', type: 'select', required: true, options: [
        { value: 'ext4', label: 'ext4' }, { value: 'xfs', label: 'xfs' }, { value: 'btrfs', label: 'btrfs' }, { value: 'vfat', label: 'vfat (FAT32)' }, { value: 'ntfs', label: 'ntfs' },
      ], group: 'Type' },
      { id: 'device', name: 'Device', type: 'text', positional: true, position: 1, required: true, placeholder: '/dev/sda1', group: 'Device' },
      { id: 'label', flag: '-L', name: 'Label', type: 'text', placeholder: 'MyDrive', group: 'Options' },
    ],
  },
  'mount': {
    id: 'mount', name: 'mount', category: 'disk', os: ['linux', 'macos'],
    description: 'Mount a filesystem', base: 'sudo mount',
    args: [
      { id: 'device', name: 'Device', type: 'text', positional: true, position: 1, placeholder: '/dev/sda1', group: 'Source' },
      { id: 'mountpoint', name: 'Mount Point', type: 'text', positional: true, position: 2, placeholder: '/mnt/data', group: 'Target' },
      { id: 'type', flag: '-t', name: 'FS Type', type: 'text', placeholder: 'ext4', group: 'Options' },
      { id: 'options', flag: '-o', name: 'Options', type: 'text', placeholder: 'ro,noexec', group: 'Options' },
      { id: 'list-all', flag: '-l', name: 'List Mounts', type: 'checkbox', default: false, description: 'Show all mounts', group: 'Query' },
    ],
  },
  'umount': {
    id: 'umount', name: 'umount', category: 'disk', os: ['linux', 'macos'],
    description: 'Unmount a filesystem', base: 'sudo umount',
    args: [
      { id: 'target', name: 'Mount Point/Device', type: 'text', positional: true, position: 1, required: true, placeholder: '/mnt/data', group: 'Target' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, warning: '⚠️ May cause data loss!', group: 'Options' },
      { id: 'lazy', flag: '-l', name: 'Lazy', type: 'checkbox', default: false, description: 'Detach now, cleanup later', group: 'Options' },
    ],
  },
  'fsck': {
    id: 'fsck', name: 'fsck', category: 'disk', os: ['linux'],
    description: 'Check and repair a filesystem', base: 'sudo fsck', danger_level: 'dangerous',
    args: [
      { id: 'device', name: 'Device', type: 'text', positional: true, position: 1, required: true, placeholder: '/dev/sda1', group: 'Device' },
      { id: 'auto-fix', flag: '-y', name: 'Auto Fix', type: 'checkbox', default: false, danger: true, warning: '⚠️ Automatically repairs!', group: 'Options' },
      { id: 'no-changes', flag: '-n', name: 'No Changes', type: 'checkbox', default: false, description: 'Read-only check', conflicts_with: ['auto-fix'], group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // COMPRESSION
  // ══════════════════════════════════════════
  'tar': {
    id: 'tar', name: 'tar', category: 'compression', os: ['linux', 'macos'],
    description: 'Archive files (create, extract, list)', base: 'tar',
    args: [
      { id: 'create', flag: '-c', name: 'Create', type: 'checkbox', default: false, conflicts_with: ['extract', 'list-tar'], group: 'Mode' },
      { id: 'extract', flag: '-x', name: 'Extract', type: 'checkbox', default: false, conflicts_with: ['create', 'list-tar'], group: 'Mode' },
      { id: 'list-tar', flag: '-t', name: 'List', type: 'checkbox', default: false, conflicts_with: ['create', 'extract'], group: 'Mode' },
      { id: 'file', flag: '-f', name: 'Archive File', type: 'text', required: true, placeholder: 'archive.tar.gz', group: 'File' },
      { id: 'gzip', flag: '-z', name: 'Gzip', type: 'checkbox', default: false, description: 'Use gzip compression', conflicts_with: ['bzip2', 'xz-tar'], group: 'Compression' },
      { id: 'bzip2', flag: '-j', name: 'Bzip2', type: 'checkbox', default: false, conflicts_with: ['gzip', 'xz-tar'], group: 'Compression' },
      { id: 'xz-tar', flag: '-J', name: 'XZ', type: 'checkbox', default: false, conflicts_with: ['gzip', 'bzip2'], group: 'Compression' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'directory', flag: '-C', name: 'Directory', type: 'text', placeholder: '/path/to/extract', description: 'Change to dir before extracting', group: 'Options' },
      { id: 'source', name: 'Source Files', type: 'text', positional: true, position: 1, placeholder: 'files/', description: 'Files/dirs to archive', group: 'Source' },
    ],
    examples: [
      { name: 'Create tar.gz', values: { create: true, gzip: true, verbose: true, file: 'archive.tar.gz', source: 'mydir/' }, output: 'tar -c -z -v -f archive.tar.gz mydir/' },
      { name: 'Extract tar.gz', values: { extract: true, gzip: true, verbose: true, file: 'archive.tar.gz' }, output: 'tar -x -z -v -f archive.tar.gz' },
    ]
  },
  'gzip': {
    id: 'gzip', name: 'gzip', category: 'compression', os: ['linux', 'macos'],
    description: 'Compress files with gzip', base: 'gzip',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Source' },
      { id: 'keep', flag: '-k', name: 'Keep Original', type: 'checkbox', default: false, group: 'Options' },
      { id: 'best', flag: '-9', name: 'Best Compression', type: 'checkbox', default: false, conflicts_with: ['fast'], group: 'Level' },
      { id: 'fast', flag: '-1', name: 'Fastest', type: 'checkbox', default: false, conflicts_with: ['best'], group: 'Level' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'gunzip': {
    id: 'gunzip', name: 'gunzip', category: 'compression', os: ['linux', 'macos'],
    description: 'Decompress gzip files', base: 'gunzip',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.gz', group: 'Source' },
      { id: 'keep', flag: '-k', name: 'Keep Compressed', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'bzip2': {
    id: 'bzip2', name: 'bzip2', category: 'compression', os: ['linux', 'macos'],
    description: 'Compress files with bzip2', base: 'bzip2',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Source' },
      { id: 'keep', flag: '-k', name: 'Keep Original', type: 'checkbox', default: false, group: 'Options' },
      { id: 'decompress', flag: '-d', name: 'Decompress', type: 'checkbox', default: false, group: 'Mode' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'xz': {
    id: 'xz', name: 'xz', category: 'compression', os: ['linux', 'macos'],
    description: 'Compress files with xz (LZMA2)', base: 'xz',
    args: [
      { id: 'file', name: 'File', type: 'text', positional: true, position: 1, required: true, placeholder: 'file.txt', group: 'Source' },
      { id: 'keep', flag: '-k', name: 'Keep Original', type: 'checkbox', default: false, group: 'Options' },
      { id: 'decompress', flag: '-d', name: 'Decompress', type: 'checkbox', default: false, group: 'Mode' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'best', flag: '-9', name: 'Best Compression', type: 'checkbox', default: false, group: 'Level' },
    ],
  },
  'zip': {
    id: 'zip', name: 'zip', category: 'compression', os: ['linux', 'macos', 'windows'],
    description: 'Package and compress files into ZIP', base: 'zip',
    args: [
      { id: 'archive', name: 'Archive', type: 'text', positional: true, position: 1, required: true, placeholder: 'archive.zip', group: 'Output' },
      { id: 'files', name: 'Files', type: 'text', positional: true, position: 2, required: true, placeholder: 'file1 file2', group: 'Source' },
      { id: 'recursive', flag: '-r', name: 'Recursive', type: 'checkbox', default: false, description: 'Include directories', group: 'Options' },
      { id: 'encrypt', flag: '-e', name: 'Encrypt', type: 'checkbox', default: false, description: 'Password protect', group: 'Options' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, group: 'Options' },
      { id: 'level', flag: '-', name: 'Level', type: 'select', options: [
        { value: '', label: 'Default (6)' }, { value: '0', label: '0 (Store)' }, { value: '9', label: '9 (Best)' },
      ], group: 'Level' },
    ],
    examples: [
      { name: 'Zip directory', values: { archive: 'backup.zip', files: 'mydir/', recursive: true }, output: 'zip -r backup.zip mydir/' },
    ]
  },
  'unzip': {
    id: 'unzip', name: 'unzip', category: 'compression', os: ['linux', 'macos', 'windows'],
    description: 'Extract ZIP archives', base: 'unzip',
    args: [
      { id: 'archive', name: 'Archive', type: 'text', positional: true, position: 1, required: true, placeholder: 'archive.zip', group: 'Source' },
      { id: 'destination', flag: '-d', name: 'Destination', type: 'text', placeholder: './output', description: 'Extract to directory', group: 'Output' },
      { id: 'list', flag: '-l', name: 'List Only', type: 'checkbox', default: false, description: 'List contents without extracting', group: 'Options' },
      { id: 'overwrite', flag: '-o', name: 'Overwrite', type: 'checkbox', default: false, group: 'Options' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // SEARCH & HELP
  // ══════════════════════════════════════════
  'locate': {
    id: 'locate', name: 'locate', category: 'search', os: ['linux', 'macos'],
    description: 'Find files by name quickly (uses database)', base: 'locate',
    args: [
      { id: 'pattern', name: 'Pattern', type: 'text', positional: true, position: 1, required: true, placeholder: '*.conf', group: 'Search' },
      { id: 'ignore-case', flag: '-i', name: 'Ignore Case', type: 'checkbox', default: false, group: 'Options' },
      { id: 'limit', flag: '-l', name: 'Limit', type: 'number', min: 1, placeholder: '10', description: 'Max results', group: 'Options' },
      { id: 'count', flag: '-c', name: 'Count Only', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'updatedb': {
    id: 'updatedb', name: 'updatedb', category: 'search', os: ['linux'],
    description: 'Update locate database', base: 'sudo updatedb',
    args: [
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'whereis': {
    id: 'whereis', name: 'whereis', category: 'search', os: ['linux', 'macos'],
    description: 'Locate binary, source, and manual pages', base: 'whereis',
    args: [
      { id: 'name', name: 'Command', type: 'text', positional: true, position: 1, required: true, placeholder: 'python', group: 'Search' },
      { id: 'binary', flag: '-b', name: 'Binaries Only', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'manual', flag: '-m', name: 'Manuals Only', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'source', flag: '-s', name: 'Sources Only', type: 'checkbox', default: false, group: 'Filter' },
    ],
  },
  'which': {
    id: 'which', name: 'which', category: 'search', os: ['linux', 'macos'],
    description: 'Locate a command in PATH', base: 'which',
    args: [
      { id: 'name', name: 'Command', type: 'text', positional: true, position: 1, required: true, placeholder: 'python3', group: 'Search' },
      { id: 'all', flag: '-a', name: 'All Matches', type: 'checkbox', default: false, description: 'Show all matching executables', group: 'Options' },
    ],
  },
  'man': {
    id: 'man', name: 'man', category: 'search', os: ['linux', 'macos'],
    description: 'Display manual pages', base: 'man',
    args: [
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 1, required: true, placeholder: 'ls', group: 'Topic' },
      { id: 'section', name: 'Section', type: 'select', options: [
        { value: '', label: 'Auto' }, { value: '1', label: '1 (Commands)' }, { value: '2', label: '2 (System calls)' },
        { value: '3', label: '3 (Library)' }, { value: '5', label: '5 (File formats)' }, { value: '8', label: '8 (Admin)' },
      ], group: 'Options' },
      { id: 'keyword', flag: '-k', name: 'Search Keywords', type: 'text', placeholder: 'network', description: 'Search man page descriptions', group: 'Search' },
    ],
  },
  'info': {
    id: 'info', name: 'info', category: 'search', os: ['linux'],
    description: 'Read GNU Info documents', base: 'info',
    args: [
      { id: 'topic', name: 'Topic', type: 'text', positional: true, position: 1, required: true, placeholder: 'coreutils', group: 'Topic' },
    ],
  },
  'whatis': {
    id: 'whatis', name: 'whatis', category: 'search', os: ['linux', 'macos'],
    description: 'Display one-line command descriptions', base: 'whatis',
    args: [
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 1, required: true, placeholder: 'ls', group: 'Topic' },
    ],
  },
  'apropos': {
    id: 'apropos', name: 'apropos', category: 'search', os: ['linux', 'macos'],
    description: 'Search manual page names and descriptions', base: 'apropos',
    args: [
      { id: 'keyword', name: 'Keyword', type: 'text', positional: true, position: 1, required: true, placeholder: 'network', group: 'Search' },
      { id: 'exact', flag: '-e', name: 'Exact Match', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'help': {
    id: 'help', name: 'help', category: 'search', os: ['linux', 'macos'],
    description: 'Display help for shell builtins', base: 'help',
    args: [
      { id: 'command', name: 'Builtin', type: 'text', positional: true, position: 1, placeholder: 'cd', description: 'Shell builtin command', group: 'Topic' },
    ],
  },

  // ══════════════════════════════════════════
  // GIT
  // ══════════════════════════════════════════
  'git-commit': {
    id: 'git-commit', name: 'git commit', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Record changes to the repository', base: 'git commit',
    args: [
      { id: 'message', flag: '-m', name: 'Message', type: 'text', required: true, placeholder: 'feat: add new feature', description: 'Commit message', group: 'Message' },
      { id: 'all', flag: '-a', name: 'Stage All', type: 'checkbox', default: false, description: 'Stage modified and deleted files', warning: 'Includes ALL modified files', group: 'Staging' },
      { id: 'amend', flag: '--amend', name: 'Amend', type: 'checkbox', default: false, danger: true, description: 'Replace the tip of current branch', warning: "Don't amend pushed commits!", group: 'Modify' },
      { id: 'no-edit', flag: '--no-edit', name: 'No Edit', type: 'checkbox', default: false, depends_on: ['amend'], group: 'Modify' },
      { id: 'no-verify', flag: '-n', name: 'Skip Hooks', type: 'checkbox', default: false, danger: true, warning: 'Skips validation', group: 'Options' },
      { id: 'allow-empty', flag: '--allow-empty', name: 'Allow Empty', type: 'checkbox', default: false, group: 'Options' },
      { id: 'author', flag: '--author', name: 'Author', type: 'text', placeholder: 'Name <email>', group: 'Author' },
    ],
    examples: [
      { name: 'Simple commit', values: { message: 'fix: resolve bug' }, output: "git commit -m 'fix: resolve bug'" },
      { name: 'Commit all', values: { message: 'update', all: true }, output: "git commit -a -m 'update'" },
    ]
  },
  'git-push': {
    id: 'git-push', name: 'git push', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Update remote refs', base: 'git push',
    args: [
      { id: 'remote', name: 'Remote', type: 'text', positional: true, position: 1, placeholder: 'origin', group: 'Target' },
      { id: 'branch', name: 'Branch', type: 'text', positional: true, position: 2, placeholder: 'main', group: 'Target' },
      { id: 'set-upstream', flag: '-u', name: 'Set Upstream', type: 'checkbox', default: false, group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, warning: '⚠️ Can overwrite history!', conflicts_with: ['force-with-lease'], group: 'Options' },
      { id: 'force-with-lease', flag: '--force-with-lease', name: 'Force with Lease', type: 'checkbox', default: false, danger: true, conflicts_with: ['force'], group: 'Options' },
      { id: 'tags', flag: '--tags', name: 'Push Tags', type: 'checkbox', default: false, group: 'Options' },
      { id: 'dry-run', flag: '-n', name: 'Dry Run', type: 'checkbox', default: false, group: 'Options' },
      { id: 'delete', flag: '--delete', name: 'Delete Remote', type: 'checkbox', default: false, danger: true, warning: '⚠️ Deletes remote branch!', group: 'Options' },
    ],
  },
  'git-pull': {
    id: 'git-pull', name: 'git pull', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Fetch and integrate changes', base: 'git pull',
    args: [
      { id: 'remote', name: 'Remote', type: 'text', positional: true, position: 1, placeholder: 'origin', group: 'Target' },
      { id: 'branch', name: 'Branch', type: 'text', positional: true, position: 2, placeholder: 'main', group: 'Target' },
      { id: 'rebase', flag: '--rebase', name: 'Rebase', type: 'checkbox', default: false, conflicts_with: ['ff-only'], group: 'Strategy' },
      { id: 'ff-only', flag: '--ff-only', name: 'Fast-Forward Only', type: 'checkbox', default: false, conflicts_with: ['rebase'], group: 'Strategy' },
      { id: 'no-commit', flag: '--no-commit', name: 'No Commit', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'git-clone': {
    id: 'git-clone', name: 'git clone', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Clone a repository', base: 'git clone',
    args: [
      { id: 'repository', name: 'Repository URL', type: 'text', positional: true, position: 1, required: true, placeholder: 'https://github.com/user/repo.git', group: 'Source' },
      { id: 'directory', name: 'Directory', type: 'text', positional: true, position: 2, placeholder: 'my-project', group: 'Target' },
      { id: 'branch', flag: '-b', name: 'Branch', type: 'text', placeholder: 'main', group: 'Options' },
      { id: 'depth', flag: '--depth', name: 'Depth', type: 'number', min: 1, placeholder: '1', description: 'Shallow clone depth', group: 'Options' },
      { id: 'single-branch', flag: '--single-branch', name: 'Single Branch', type: 'checkbox', default: false, group: 'Options' },
      { id: 'recursive', flag: '--recursive', name: 'Recursive', type: 'checkbox', default: false, description: 'Clone submodules', group: 'Options' },
      { id: 'bare', flag: '--bare', name: 'Bare', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'git-add': {
    id: 'git-add', name: 'git add', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Add file contents to the staging area', base: 'git add',
    args: [
      { id: 'files', name: 'Files', type: 'text', positional: true, position: 1, placeholder: '.', description: 'Files to stage (use . for all)', group: 'Target' },
      { id: 'all', flag: '-A', name: 'All', type: 'checkbox', default: false, description: 'Stage all changes', group: 'Options' },
      { id: 'patch', flag: '-p', name: 'Patch', type: 'checkbox', default: false, description: 'Interactively choose hunks', group: 'Options' },
      { id: 'dry-run', flag: '-n', name: 'Dry Run', type: 'checkbox', default: false, group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'git-status': {
    id: 'git-status', name: 'git status', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Show working tree status', base: 'git status',
    args: [
      { id: 'short', flag: '-s', name: 'Short', type: 'checkbox', default: false, description: 'Short format', group: 'Format' },
      { id: 'branch', flag: '-b', name: 'Branch Info', type: 'checkbox', default: false, description: 'Show branch info in short format', group: 'Format' },
      { id: 'untracked', flag: '-u', name: 'Untracked Files', type: 'select', options: [
        { value: '', label: 'Normal' }, { value: 'no', label: 'No' }, { value: 'all', label: 'All' },
      ], group: 'Options' },
    ],
  },
  'git-log': {
    id: 'git-log', name: 'git log', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Show commit history', base: 'git log',
    args: [
      { id: 'oneline', flag: '--oneline', name: 'One Line', type: 'checkbox', default: false, group: 'Format' },
      { id: 'graph', flag: '--graph', name: 'Graph', type: 'checkbox', default: false, description: 'Show branch graph', group: 'Format' },
      { id: 'all', flag: '--all', name: 'All Branches', type: 'checkbox', default: false, group: 'Filter' },
      { id: 'max-count', flag: '-n', name: 'Max Count', type: 'number', min: 1, placeholder: '10', group: 'Filter' },
      { id: 'author', flag: '--author', name: 'Author', type: 'text', placeholder: 'name', group: 'Filter' },
      { id: 'since', flag: '--since', name: 'Since', type: 'text', placeholder: '2024-01-01', group: 'Filter' },
      { id: 'stat', flag: '--stat', name: 'Stats', type: 'checkbox', default: false, description: 'Show file change stats', group: 'Format' },
    ],
    examples: [
      { name: 'Pretty log', values: { oneline: true, graph: true, all: true, 'max-count': 20 }, output: 'git log --oneline --graph --all -n 20' },
    ]
  },
  'git-branch': {
    id: 'git-branch', name: 'git branch', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'List, create, or delete branches', base: 'git branch',
    args: [
      { id: 'name', name: 'Branch Name', type: 'text', positional: true, position: 1, placeholder: 'feature-branch', description: 'Create new branch with this name', group: 'Name' },
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, description: 'List remote and local branches', group: 'List' },
      { id: 'remote', flag: '-r', name: 'Remote Only', type: 'checkbox', default: false, conflicts_with: ['all'], group: 'List' },
      { id: 'delete', flag: '-d', name: 'Delete', type: 'checkbox', default: false, danger: true, group: 'Options' },
      { id: 'force-delete', flag: '-D', name: 'Force Delete', type: 'checkbox', default: false, danger: true, warning: '⚠️ Deletes even if not merged!', conflicts_with: ['delete'], group: 'Options' },
      { id: 'verbose', flag: '-v', name: 'Verbose', type: 'checkbox', default: false, group: 'Options' },
      { id: 'move', flag: '-m', name: 'Rename', type: 'text', placeholder: 'new-name', description: 'Rename current branch', group: 'Options' },
    ],
  },
  'git-checkout': {
    id: 'git-checkout', name: 'git checkout', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Switch branches or restore files', base: 'git checkout',
    args: [
      { id: 'target', name: 'Branch/File', type: 'text', positional: true, position: 1, placeholder: 'main', group: 'Target' },
      { id: 'create', flag: '-b', name: 'Create Branch', type: 'checkbox', default: false, description: 'Create and switch to new branch', group: 'Options' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, warning: '⚠️ Discards local changes!', group: 'Options' },
    ],
  },
  'git-merge': {
    id: 'git-merge', name: 'git merge', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Join two or more development histories', base: 'git merge',
    args: [
      { id: 'branch', name: 'Branch', type: 'text', positional: true, position: 1, required: true, placeholder: 'feature-branch', group: 'Source' },
      { id: 'no-ff', flag: '--no-ff', name: 'No Fast-Forward', type: 'checkbox', default: false, description: 'Always create merge commit', group: 'Strategy' },
      { id: 'squash', flag: '--squash', name: 'Squash', type: 'checkbox', default: false, description: 'Squash all commits into one', group: 'Strategy' },
      { id: 'abort', flag: '--abort', name: 'Abort', type: 'checkbox', default: false, description: 'Abort current merge', group: 'Options' },
      { id: 'message', flag: '-m', name: 'Message', type: 'text', placeholder: 'Merge feature', group: 'Options' },
    ],
  },
  'git-stash': {
    id: 'git-stash', name: 'git stash', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Stash changes temporarily', base: 'git stash',
    args: [
      { id: 'action', name: 'Action', type: 'select', positional: true, position: 1, options: [
        { value: '', label: 'Push (default)' }, { value: 'pop', label: 'Pop' }, { value: 'list', label: 'List' },
        { value: 'apply', label: 'Apply' }, { value: 'drop', label: 'Drop' }, { value: 'clear', label: 'Clear' },
      ], group: 'Action' },
      { id: 'message', flag: '-m', name: 'Message', type: 'text', placeholder: 'WIP: feature', group: 'Options' },
      { id: 'include-untracked', flag: '-u', name: 'Include Untracked', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'git-reset': {
    id: 'git-reset', name: 'git reset', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Reset current HEAD to specified state', base: 'git reset', danger_level: 'dangerous',
    args: [
      { id: 'commit', name: 'Commit', type: 'text', positional: true, position: 1, placeholder: 'HEAD~1', group: 'Target' },
      { id: 'soft', flag: '--soft', name: 'Soft', type: 'checkbox', default: false, description: 'Keep changes staged', conflicts_with: ['mixed', 'hard'], group: 'Mode' },
      { id: 'mixed', flag: '--mixed', name: 'Mixed', type: 'checkbox', default: false, description: 'Keep changes unstaged (default)', conflicts_with: ['soft', 'hard'], group: 'Mode' },
      { id: 'hard', flag: '--hard', name: 'Hard', type: 'checkbox', default: false, danger: true, warning: '⚠️ DELETES all changes permanently!', conflicts_with: ['soft', 'mixed'], group: 'Mode' },
    ],
  },
  'git-diff': {
    id: 'git-diff', name: 'git diff', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Show changes between commits, staging, working tree', base: 'git diff',
    args: [
      { id: 'target', name: 'Commit/Branch', type: 'text', positional: true, position: 1, placeholder: 'HEAD~1', group: 'Target' },
      { id: 'staged', flag: '--staged', name: 'Staged', type: 'checkbox', default: false, description: 'Show staged changes', group: 'Options' },
      { id: 'stat', flag: '--stat', name: 'Stats Only', type: 'checkbox', default: false, group: 'Format' },
      { id: 'name-only', flag: '--name-only', name: 'Names Only', type: 'checkbox', default: false, group: 'Format' },
      { id: 'color', flag: '--color', name: 'Color', type: 'checkbox', default: false, group: 'Format' },
    ],
  },
  'git-fetch': {
    id: 'git-fetch', name: 'git fetch', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Download objects and refs from remote', base: 'git fetch',
    args: [
      { id: 'remote', name: 'Remote', type: 'text', positional: true, position: 1, placeholder: 'origin', group: 'Target' },
      { id: 'all', flag: '--all', name: 'All Remotes', type: 'checkbox', default: false, group: 'Options' },
      { id: 'prune', flag: '-p', name: 'Prune', type: 'checkbox', default: false, description: 'Remove deleted remote branches', group: 'Options' },
      { id: 'tags', flag: '--tags', name: 'Tags', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'git-rebase': {
    id: 'git-rebase', name: 'git rebase', category: 'git', os: ['linux', 'macos', 'windows'],
    description: 'Reapply commits on top of another base', base: 'git rebase', danger_level: 'caution',
    args: [
      { id: 'branch', name: 'Branch', type: 'text', positional: true, position: 1, placeholder: 'main', group: 'Target' },
      { id: 'interactive', flag: '-i', name: 'Interactive', type: 'checkbox', default: false, description: 'Edit commits during rebase', group: 'Options' },
      { id: 'abort', flag: '--abort', name: 'Abort', type: 'checkbox', default: false, description: 'Cancel current rebase', group: 'Options' },
      { id: 'continue', flag: '--continue', name: 'Continue', type: 'checkbox', default: false, description: 'Continue after resolving conflicts', group: 'Options' },
    ],
  },

  // ══════════════════════════════════════════
  // DOCKER
  // ══════════════════════════════════════════
  'docker-run': {
    id: 'docker-run', name: 'docker run', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Run a container from an image', base: 'docker run',
    args: [
      { id: 'image', name: 'Image', type: 'text', positional: true, position: 1, required: true, placeholder: 'nginx:latest', group: 'Image' },
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 2, placeholder: '/bin/bash', group: 'Image' },
      { id: 'name', flag: '--name', name: 'Container Name', type: 'text', placeholder: 'my-container', group: 'Basic' },
      { id: 'detach', flag: '-d', name: 'Detach', type: 'checkbox', default: false, description: 'Run in background', group: 'Basic' },
      { id: 'interactive', flag: '-i', name: 'Interactive', type: 'checkbox', default: false, group: 'Basic' },
      { id: 'tty', flag: '-t', name: 'TTY', type: 'checkbox', default: false, group: 'Basic' },
      { id: 'rm', flag: '--rm', name: 'Remove on Exit', type: 'checkbox', default: false, group: 'Basic' },
      { id: 'port', flag: '-p', name: 'Port', type: 'text', placeholder: '8080:80', description: 'host:container', group: 'Network' },
      { id: 'volume', flag: '-v', name: 'Volume', type: 'text', placeholder: '/host:/container', group: 'Storage' },
      { id: 'env', flag: '-e', name: 'Environment', type: 'text', placeholder: 'KEY=value', group: 'Environment' },
      { id: 'network', flag: '--network', name: 'Network', type: 'select', options: [
        { value: '', label: 'Default' }, { value: 'bridge', label: 'Bridge' }, { value: 'host', label: 'Host' }, { value: 'none', label: 'None' },
      ], group: 'Network' },
      { id: 'restart', flag: '--restart', name: 'Restart Policy', type: 'select', options: [
        { value: '', label: 'No' }, { value: 'always', label: 'Always' }, { value: 'unless-stopped', label: 'Unless Stopped' }, { value: 'on-failure', label: 'On Failure' },
      ], group: 'Options' },
    ],
    examples: [
      { name: 'Interactive shell', values: { image: 'ubuntu:latest', command: '/bin/bash', interactive: true, tty: true, rm: true }, output: 'docker run -i -t --rm ubuntu:latest /bin/bash' },
      { name: 'Web server', values: { image: 'nginx:latest', name: 'web', detach: true, port: '8080:80' }, output: 'docker run -d --name web -p 8080:80 nginx:latest' },
    ]
  },
  'docker-ps': {
    id: 'docker-ps', name: 'docker ps', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'List containers', base: 'docker ps',
    args: [
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, description: 'Show all (not just running)', group: 'Filter' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, description: 'Only IDs', group: 'Output' },
      { id: 'size', flag: '-s', name: 'Size', type: 'checkbox', default: false, group: 'Output' },
      { id: 'filter', flag: '-f', name: 'Filter', type: 'text', placeholder: 'status=running', group: 'Filter' },
      { id: 'format', flag: '--format', name: 'Format', type: 'text', placeholder: '{{.Names}}', group: 'Output' },
      { id: 'last', flag: '-n', name: 'Last N', type: 'number', min: 1, placeholder: '5', group: 'Filter' },
    ],
  },
  'docker-build': {
    id: 'docker-build', name: 'docker build', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Build an image from Dockerfile', base: 'docker build',
    args: [
      { id: 'path', name: 'Context Path', type: 'text', positional: true, position: 1, required: true, placeholder: '.', group: 'Source' },
      { id: 'tag', flag: '-t', name: 'Tag', type: 'text', placeholder: 'myapp:latest', description: 'Name and tag', group: 'Options' },
      { id: 'file', flag: '-f', name: 'Dockerfile', type: 'text', placeholder: 'Dockerfile', group: 'Options' },
      { id: 'no-cache', flag: '--no-cache', name: 'No Cache', type: 'checkbox', default: false, group: 'Options' },
      { id: 'build-arg', flag: '--build-arg', name: 'Build Arg', type: 'text', placeholder: 'VERSION=1.0', group: 'Options' },
    ],
  },
  'docker-pull': {
    id: 'docker-pull', name: 'docker pull', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Pull an image from a registry', base: 'docker pull',
    args: [
      { id: 'image', name: 'Image', type: 'text', positional: true, position: 1, required: true, placeholder: 'nginx:latest', group: 'Image' },
      { id: 'all-tags', flag: '-a', name: 'All Tags', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'docker-push': {
    id: 'docker-push', name: 'docker push', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Push an image to a registry', base: 'docker push',
    args: [
      { id: 'image', name: 'Image', type: 'text', positional: true, position: 1, required: true, placeholder: 'user/myapp:latest', group: 'Image' },
      { id: 'all-tags', flag: '-a', name: 'All Tags', type: 'checkbox', default: false, group: 'Options' },
    ],
  },
  'docker-images': {
    id: 'docker-images', name: 'docker images', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'List images', base: 'docker images',
    args: [
      { id: 'all', flag: '-a', name: 'All', type: 'checkbox', default: false, description: 'Include intermediates', group: 'Filter' },
      { id: 'quiet', flag: '-q', name: 'Quiet', type: 'checkbox', default: false, description: 'Only IDs', group: 'Output' },
      { id: 'filter', flag: '-f', name: 'Filter', type: 'text', placeholder: 'dangling=true', group: 'Filter' },
    ],
  },
  'docker-exec': {
    id: 'docker-exec', name: 'docker exec', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Run a command in a running container', base: 'docker exec',
    args: [
      { id: 'container', name: 'Container', type: 'text', positional: true, position: 1, required: true, placeholder: 'my-container', group: 'Target' },
      { id: 'command', name: 'Command', type: 'text', positional: true, position: 2, required: true, placeholder: '/bin/bash', group: 'Command' },
      { id: 'interactive', flag: '-i', name: 'Interactive', type: 'checkbox', default: false, group: 'Options' },
      { id: 'tty', flag: '-t', name: 'TTY', type: 'checkbox', default: false, group: 'Options' },
      { id: 'user', flag: '-u', name: 'User', type: 'text', placeholder: 'root', group: 'Options' },
      { id: 'workdir', flag: '-w', name: 'Working Dir', type: 'text', placeholder: '/app', group: 'Options' },
    ],
  },
  'docker-logs': {
    id: 'docker-logs', name: 'docker logs', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Fetch the logs of a container', base: 'docker logs',
    args: [
      { id: 'container', name: 'Container', type: 'text', positional: true, position: 1, required: true, placeholder: 'my-container', group: 'Target' },
      { id: 'follow', flag: '-f', name: 'Follow', type: 'checkbox', default: false, description: 'Stream logs in real-time', group: 'Options' },
      { id: 'tail', flag: '--tail', name: 'Tail', type: 'number', min: 0, placeholder: '100', description: 'Number of lines from end', group: 'Options' },
      { id: 'timestamps', flag: '-t', name: 'Timestamps', type: 'checkbox', default: false, group: 'Options' },
      { id: 'since', flag: '--since', name: 'Since', type: 'text', placeholder: '1h', description: 'Show logs since (e.g. 1h, 2024-01-01)', group: 'Filter' },
    ],
  },
  'docker-stop': {
    id: 'docker-stop', name: 'docker stop', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Stop running containers', base: 'docker stop',
    args: [
      { id: 'container', name: 'Container', type: 'text', positional: true, position: 1, required: true, placeholder: 'my-container', group: 'Target' },
      { id: 'time', flag: '-t', name: 'Timeout', type: 'number', min: 0, placeholder: '10', description: 'Seconds before killing', group: 'Options' },
    ],
  },
  'docker-rm': {
    id: 'docker-rm', name: 'docker rm', category: 'docker', os: ['linux', 'macos', 'windows'],
    description: 'Remove containers', base: 'docker rm', danger_level: 'caution',
    args: [
      { id: 'container', name: 'Container', type: 'text', positional: true, position: 1, required: true, placeholder: 'my-container', group: 'Target' },
      { id: 'force', flag: '-f', name: 'Force', type: 'checkbox', default: false, danger: true, description: 'Force remove running container', group: 'Options' },
      { id: 'volumes', flag: '-v', name: 'Remove Volumes', type: 'checkbox', default: false, danger: true, warning: '⚠️ Deletes associated volumes!', group: 'Options' },
    ],
  },
};
