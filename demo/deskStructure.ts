import {StructureResolver} from 'sanity/desk'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Menu')
    .items([
      S.listItem()
        .title('Instagram Posts')
        .child(
          S.editor()
            .title('Instagram Posts')
            .id('instagramPosts')
            .schemaType('instagramPosts')
            .documentId('instagramPosts')
        ),
    ])
