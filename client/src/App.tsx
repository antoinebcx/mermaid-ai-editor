import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import MermaidEditor from './components/MermaidEditor';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MermaidEditor />
    </ThemeProvider>
  );
}

export default App;