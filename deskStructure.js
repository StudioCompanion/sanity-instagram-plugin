import S from "@sanity/desk-tool/structure-builder";

export default () =>
  S.list()
    .title("Menu")
    .items([
      S.listItem()
        .title("Instagram Posts")
        .child(
          S.editor()
            .title("Instagram Posts")
            .id("instagramPosts")
            .schemaType("instagramPosts")
            .documentId("instagramPosts")
        ),
    ]);
