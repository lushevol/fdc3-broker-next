import RefreshIcon from '@mui/icons-material/Refresh';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Input from '../../components/Input';
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
    store,
    // categories, // Removed
    // category, // Removed
    // onCategoryChange, // Removed
    // onInputChange, // Removed
    // inputValue, // Removed
    refresh,
    disableCreateNew,
    intents,
    contexts,
    createIntent,
    updateIntent,
    deleteIntent,
    createContext,
    updateContext,
    deleteContext,
    isLoading,
    openDetail, // State tracking if dialog is open
    record, // Record being edited
    onOpen, // Function to open (edit/new)
    onClose, // Function to close
    handleSaveDeclaration, // Custom save handler
    tiles, // Available tiles
    ...rest
  } = useController(props);

  const [tab, setTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`} spacing={0} direction="column">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="fdc3 declaration tabs">
            <Tab label="Declarations" />
            <Tab label="Intents Master List" />
            <Tab label="Contexts Master List" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, height: '100%', display: tab === 0 ? 'block' : 'none' }}>
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
        </Box>

        <Box sx={{ p: 2, height: '100%', display: tab === 1 ? 'block' : 'none' }}>
          <IntentMasterList
            intents={intents}
            onCreate={createIntent}
            onUpdate={updateIntent}
            onDelete={deleteIntent}
            isLoading={isLoading}
            readOnly={true}
          />
        </Box>

        <Box sx={{ p: 2, height: '100%', display: tab === 2 ? 'block' : 'none' }}>
          <ContextMasterList
            contexts={contexts}
            onCreate={createContext}
            onUpdate={updateContext}
            onDelete={deleteContext}
            isLoading={isLoading}
            readOnly={true}
          />
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
          readOnly={true}
        />
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(FDC3Declaration);
