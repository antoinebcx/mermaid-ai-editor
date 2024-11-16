export const ACCEPTED_FILES = {
    'text/*': ['.txt', '.md', '.csv', '.json', '.xml', '.yml', '.yaml'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.html', '.css', 
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.cs', '.m', '.scala', '.hs', 
      '.sql', '.sh', '.ps1'
    ]
} as const;
  
export const TEXT_EXTENSIONS = [
    '.txt', '.md', '.csv', '.json', '.xml', '.yml', '.yaml'
] as const;
  
export const CODE_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.html', 
    '.css', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.cs', '.m', 
    '.scala', '.hs', '.sql', '.sh', '.ps1'
] as const;