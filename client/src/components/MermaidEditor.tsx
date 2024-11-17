import React, { useEffect, useRef } from 'react';
import { Box, Alert, useTheme } from '@mui/material';
import { DiagramContainer, TransformableArea } from './diagram-editor/styled';
import { DiagramControls } from './diagram-editor/components/DiagramControls';
import { useCodeHistory } from './diagram-editor/hooks/useCodeHistory';
import { useZoomPan } from './diagram-editor/hooks/useZoomPan';
import { useDiagramRenderer } from './diagram-editor/hooks/useDiagramRenderer';
import { useChat } from './diagram-editor/hooks/useChat';
import { useDiagramInteraction } from './diagram-editor/hooks/useDiagramInteraction';
import { useMermaidInteraction } from './diagram-editor/hooks/useMermaidInteraction';
import { NAVBAR_HEIGHT } from './diagram-editor/constants';
import CodeEditor from './code-editor/CodeEditor';
import ChatInput from './chat-input/ChatInput';
import { ChatInputRef } from './chat-input/types'
import { MermaidElementEditor } from './diagram-editor/components/ElementEditor';
import { useDownloadDiagram } from './diagram-editor/hooks/useDownloadDiagram';

const MermaidEditor = () => {
  const theme = useTheme();
  const chatInputRef = useRef<ChatInputRef>(null);
  const transformableRef = useRef<HTMLDivElement>(null);

  const {
    code,
    updateCode,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  } = useCodeHistory();

  const zoomPan = useZoomPan();
  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    getTransformStyle,
  } = zoomPan;

  const { error } = useDiagramRenderer(code, zoom, theme.palette.mode);
  const {
    chatError,
    isChatLoading,
    handleChatMessage,
  } = useChat(code, updateCode);

  const {
    selectedElement,
    anchorEl,
    handleDiagramClick,
    handleDoubleClick,
    handleElementUpdate,
    handleClose
  } = useMermaidInteraction({ code, updateCode });

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useDiagramInteraction(zoomPan);

  const {
    isDownloadMenuOpen,
    downloadAnchorEl,
    handleDownloadClick,
    handleDownloadClose,
    downloadDiagram
  } = useDownloadDiagram();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleUndo, handleRedo]);

  const handleLineSelect = (lineNumber: number, lineContent: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.handleLineTarget(lineNumber, lineContent);
    }
  };

  return (
    <>
      {!isChatLoading && error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
      {!isChatLoading && chatError && <Alert severity="error" sx={{ m: 2 }}>{chatError}</Alert>}

      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        position: 'relative',
        flexDirection: { xs: 'column', md: 'row' },
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '50vh', md: '100%' },
            position: 'relative',
          }}
        >
          <CodeEditor
            value={code}
            onChange={(e) => updateCode(e.target.value)}
            placeholder="Enter Mermaid diagram code here..."
            onLineSelect={handleLineSelect}
          />
          <ChatInput 
            ref={chatInputRef}
            onSend={handleChatMessage}
            isLoading={isChatLoading}
            currentDiagram={code}
          />
        </Box>

        <DiagramContainer
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleDiagramClick}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '50vh', md: '100%' },
          }}
        >
          <TransformableArea
            ref={transformableRef}
            style={getTransformStyle()}
          >
            <Box
              id="mermaid-preview"
              onClick={(e) => {
                console.log('Preview box clicked');
                handleDiagramClick(e);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': {
                  cursor: 'pointer',
                  '& g[id^="flowchart-"]': {
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  },
                },
              }}
            />
          </TransformableArea>

          <DiagramControls
            zoom={zoom}
            canUndo={canUndo}
            canRedo={canRedo}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onUndo={handleUndo}
            onRedo={handleRedo}
            downloadProps={{
              isOpen: isDownloadMenuOpen,
              anchorEl: downloadAnchorEl,
              onDownload: downloadDiagram,
              onDownloadClick: handleDownloadClick,
              onClose: handleDownloadClose,
            }}
          />

          {selectedElement && (
            <MermaidElementEditor
              element={selectedElement}
              anchorEl={anchorEl}
              onClose={handleClose}
              onUpdate={handleElementUpdate}
              zoom={zoom}
            />
          )}
        </DiagramContainer>
      </Box>
    </>
  );
};

export default MermaidEditor;