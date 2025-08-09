import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
} from '@mui/material'
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material'
import { RootState } from '../store/store'
import { addField, saveForm, loadSavedForms, clearCurrentForm } from '../store/formBuilderSlice'
import { FormField } from '../types/form'
import FieldBuilder from '../components/FieldBuilder'
import FieldEditor from '../components/FieldEditor'

const CreateForm: React.FC = () => {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  const [showAddField, setShowAddField] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [formName, setFormName] = useState('')
  const [editingField, setEditingField] = useState<{ index: number; field: FormField } | null>(null)

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  const handleAddField = (field: FormField) => {
    dispatch(addField(field))
    setShowAddField(false)
  }

  const handleSaveForm = () => {
    if (formName.trim() && currentForm.fields.length > 0) {
      dispatch(saveForm(formName.trim()))
      setShowSaveDialog(false)
      setFormName('')
      dispatch(clearCurrentForm())
    }
  }

  const handleEditField = (index: number, field: FormField) => {
    setEditingField({ index, field })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Create Form
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => setShowSaveDialog(true)}
          disabled={currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      {currentForm.fields.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No fields added yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start building your form by adding fields
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddField(true)}
          >
            Add First Field
          </Button>
        </Paper>
      ) : (
        <Box>
          <FieldBuilder
            fields={currentForm.fields}
            onEditField={handleEditField}
          />
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add field"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowAddField(true)}
      >
        <AddIcon />
      </Fab>

      {/* Add Field Dialog */}
      <Dialog
        open={showAddField}
        onClose={() => setShowAddField(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <FieldEditor
            onSave={handleAddField}
            onCancel={() => setShowAddField(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog
        open={!!editingField}
        onClose={() => setEditingField(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Field</DialogTitle>
        <DialogContent>
          {editingField && (
            <FieldEditor
              field={editingField.field}
              fieldIndex={editingField.index}
              onSave={() => setEditingField(null)}
              onCancel={() => setEditingField(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CreateForm
