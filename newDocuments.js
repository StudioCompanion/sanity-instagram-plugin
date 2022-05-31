import S from '@sanity/base/structure-builder'

import { LOCKED_DOCUMENT_TYPES } from './constants'

export default [
  // Use default values, but filter out templates on certain document types
  ...S.defaultInitialValueTemplateItems().filter(
    ({ spec: { id } }) => ![...LOCKED_DOCUMENT_TYPES, 'settings'].includes(id)
  ),
]
