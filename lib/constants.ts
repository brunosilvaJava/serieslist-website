// Application constants

export const APP_NAME = 'Series List'
export const APP_DESCRIPTION = 'Create and share your favorite TV series lists'

// Pagination
export const DEFAULT_PAGE_SIZE = 30
export const MAX_PAGE_SIZE = 100

// Validation
export const MIN_PASSWORD_LENGTH = 6
export const MIN_LIST_NAME_LENGTH = 1
export const MIN_SERIE_TITLE_LENGTH = 1

// Messages
export const MESSAGES = {
  AUTH: {
    UNAUTHORIZED: 'You must be logged in to access this resource',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
  },
  LIST: {
    NOT_FOUND: 'List not found',
    DELETED: 'List deleted successfully',
    CREATED: 'List created successfully',
    UPDATED: 'List updated successfully',
  },
  SERIE: {
    NOT_FOUND: 'Serie not found',
    DELETED: 'Serie deleted successfully',
    CREATED: 'Serie created successfully',
    UPDATED: 'Serie updated successfully',
  },
  ERROR: {
    INTERNAL: 'Internal server error',
    INVALID_INPUT: 'Invalid input',
  },
}
