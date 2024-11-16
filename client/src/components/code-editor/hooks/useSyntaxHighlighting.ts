import { useTheme } from '@mui/material';
import { SyntaxColors } from '../types';

export const useSyntaxHighlighting = () => {
  const theme = useTheme();

  const getColors = (): SyntaxColors => ({
    keyword: theme.palette.mode === 'dark' ? '#B39DDB' : '#8b62d1',
    node: theme.palette.mode === 'dark' ? '#4fa1e3' : '#49a8f5',
    operator: theme.palette.mode === 'dark' ? '#7DD180' : '#40d648',
    hexColor: (match: string) => match,
  });

  const highlightSyntax = (code: string): string[] => {
    const colors = getColors();
    
    return code.split('\n').map((line) => {
      const coloredLine = line
        .replace(/<br\/>/g, '&lt;br/&gt;')
        .replace(/#[A-Fa-f0-9]{6}/g, (match) => 
          `<span style="color: ${colors.hexColor(match)}">${match}</span>`)
        .replace(/\b(graph|TD|LR|TB|RL)\b/g, 
          `<span style="color: ${colors.keyword}">$1</span>`)
        .replace(/\b([A-Za-z])\b|([A-Za-z][A-Za-z0-9]*?)(\(.*?\)|\[.*?\])/g, (match, single, name, shape) => {
          if (single) {
            return `<span style="color: ${colors.node}">${single}</span>`;
          }
          return `<span style="color: ${colors.node}">${name}</span>${shape}`;
        })
        .replace(/-->/g, `<span style="color: ${colors.operator}">--></span>`);

      return coloredLine || '&nbsp;';
    });
  };

  return { highlightSyntax };
};