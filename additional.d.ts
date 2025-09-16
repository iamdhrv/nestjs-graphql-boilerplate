declare module 'graphql-upload/GraphQLUpload.js' {
  import { GraphQLScalarType } from 'graphql';
  const GraphQLUpload: GraphQLScalarType;
  export default GraphQLUpload;
}

declare module 'graphql-upload/graphqlUploadExpress.js' {
  import { RequestHandler } from 'express';
  interface GraphQLUploadOptions {
    maxFileSize?: number;
    maxFiles?: number;
  }
  function graphqlUploadExpress(options?: GraphQLUploadOptions): RequestHandler;
  export default graphqlUploadExpress;
}