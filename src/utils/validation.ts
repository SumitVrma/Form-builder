import { FormField, ValidationRule, FormData } from '../types/form'

export function validateField(field: FormField, value: any): string | null {
  for (const rule of field.validationRules) {
    const error = validateRule(rule, value, field.label)
    if (error) return error
  }
  return null
}

function validateRule(rule: ValidationRule, value: any, fieldLabel: string): string | null {
  switch (rule.type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message || `${fieldLabel} is required`
      }
      break

    case 'notEmpty':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message || `${fieldLabel} cannot be empty`
      }
      break

    case 'minLength':
      if (typeof value === 'string' && value.length < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value} characters`
      }
      break

    case 'maxLength':
      if (typeof value === 'string' && value.length > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value} characters`
      }
      break

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return rule.message || `${fieldLabel} must be a valid email address`
      }
      break

    case 'password':
      if (value && (value.length < 8 || !/\d/.test(value))) {
        return rule.message || `${fieldLabel} must be at least 8 characters and contain a number`
      }
      break
  }

  return null
}

export function calculateDerivedValue(
  field: FormField, 
  formData: FormData, 
  allFields: FormField[]
): any {
  if (!field.isDerived || !field.derivedConfig) return ''

  const { logic, formula, parentFields } = field.derivedConfig

  switch (logic) {
    case 'age_from_dob':
      const dobField = allFields.find(f => f.type === 'date')
      if (dobField && formData[dobField.id]) {
        const dob = new Date(formData[dobField.id])
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          return age - 1
        }
        return age
      }
      break

    case 'sum':
      const numberFields = allFields.filter(f => f.type === 'number')
      let sum = 0
      numberFields.forEach(f => {
        const val = parseFloat(formData[f.id]) || 0
        sum += val
      })
      return sum

    case 'concat':
      const textFields = allFields.filter(f => f.type === 'text')
      return textFields.map(f => formData[f.id] || '').join(' ')

    case 'custom':
      try {
        // Simple formula evaluation (for demo purposes)
        // In production, you'd want a more robust formula parser
        let evaluatedFormula = formula
        allFields.forEach(f => {
          const regex = new RegExp(`\\b${f.label}\\b`, 'g')
          evaluatedFormula = evaluatedFormula.replace(regex, formData[f.id] || '0')
        })
        // Basic math evaluation (unsafe in production - use a proper parser)
        return eval(evaluatedFormula)
      } catch {
        return 'Error in formula'
      }
  }

  return ''
}
