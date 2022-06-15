import {SchemaTypeDefinition} from 'sanity'

export const InstagramPostSchema: SchemaTypeDefinition = {
  name: 'instagramPosts',
  title: 'Instagram Posts',
  type: 'document',
  fields: [
    {
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [
        {
          type: 'image',
        },
      ],
    },
  ],
}
