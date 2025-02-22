import { type SchemaTypeDefinition } from 'sanity'
import { authorType } from './author'
import { articleType } from './article'
import { playlist } from './playlist'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [authorType, articleType, playlist],
}
