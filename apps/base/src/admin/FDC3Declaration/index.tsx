import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Main from '../common/Main';
import type { FDC3DeclarationProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';
import IntentMasterList from './common/IntentMasterList';
import ContextMasterList from './common/ContextMasterList';
import DeclarationDialog from './common/DeclarationDialog';

const FDC3Declaration: React.FC<FDC3DeclarationProps> = (
  props: FDC3DeclarationProps,
): ReactElement => {
  const {
    // categories, // Removed
    // category, // Removed
    // onCategoryChange, // Removed
    // onInputChange, // Removed
    // inputValue, // Removed
    disableCreateNew,
    intents,
    contexts,
    createIntent,
    updateIntent,
    deleteIntent,
    createContext,
    updateContext,
    deleteContext,
    deleteDeclaration,
    isLoading,
    openDetail, // State tracking if dialog is open
    record, // Record being edited
    onClose, // Function to close
    handleSaveDeclaration, // Custom save handler
    tiles, // Available tiles
    search,
    setSearch,
    summary,
    intentReferences,
    contextReferences,
    ...rest
  } = useController(props);

  const [tab, setTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const tabPanelSx = (isActive: boolean) => ({
    p: 2,
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: isActive ? 'flex' : 'none',
    flexDirection: 'column',
  });

  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`} spacing={0} direction="column">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, flexShrink: 0 }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="fdc3 declaration tabs">
            <Tab label="Declarations" />
            <Tab label="Intents Master List" />
            <Tab label="Contexts Master List" />
          </Tabs>
        </Box>

        <Box sx={tabPanelSx(tab === 0)}>
          {tab === 0 && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
                  gap: 1,
                  mb: 2,
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{ p: 1, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Declarations
                  </Typography>
                  <Typography variant="h6">{summary.declarations}</Typography>
                </Box>
                <Box
                  sx={{ p: 1, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Intents
                  </Typography>
                  <Typography variant="h6">{summary.intents}</Typography>
                </Box>
                <Box
                  sx={{ p: 1, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Contexts
                  </Typography>
                  <Typography variant="h6">{summary.contexts}</Typography>
                </Box>
                <Box
                  sx={{ p: 1, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Empty
                  </Typography>
                  <Typography variant="h6">{summary.emptyDeclarations}</Typography>
                </Box>
              </Box>
              <TextField
                label="Search FDC3"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                size="small"
                fullWidth
                sx={{ mb: 2, flexShrink: 0 }}
              />
              {/* Removed Category Selection Header */}
              <Main
                titleCreateNew="Create New Declaration"
                columnVisibilityModel={{}}
                disabledCreateNew={disableCreateNew}
                isLoading={isLoading}
                openDetail={false}
                openAudit={false}
                onCloseAudit={() => {}}
                auditColumns={[]}
                auditRows={[]}
                // TableProps requirements
                record={record || {}}
                onClose={onClose}
                onChange={() => {}}
                onUpdate={() => {}}
                onVerify={() => {}}
                onDeactivate={() => {}}
                onSave={() => {}}
                onReset={() => {}}
                resetId={0}
                {...rest}
              />
            </>
          )}
        </Box>

        <Box sx={tabPanelSx(tab === 1)}>
          {tab === 1 && (
            <IntentMasterList
              intents={intents}
              onCreate={createIntent}
              onUpdate={updateIntent}
              onDelete={deleteIntent}
              isLoading={isLoading}
              readOnly={false}
              getReferences={intentReferences}
            />
          )}
        </Box>

        <Box sx={tabPanelSx(tab === 2)}>
          {tab === 2 && (
            <ContextMasterList
              contexts={contexts}
              onCreate={createContext}
              onUpdate={updateContext}
              onDelete={deleteContext}
              isLoading={isLoading}
              readOnly={false}
              getReferences={contextReferences}
            />
          )}
        </Box>

        {/* Custom Declaration Dialog */}
        <DeclarationDialog
          open={openDetail}
          onClose={onClose}
          onSave={handleSaveDeclaration}
          initialData={record}
          tiles={tiles}
          intents={intents}
          contexts={contexts}
          isEdit={record?.mode === 'edit'}
          readOnly={false}
          onDelete={deleteDeclaration}
        />
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(FDC3Declaration);
