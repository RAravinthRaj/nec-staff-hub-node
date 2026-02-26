/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { mergeTypeDefs } from '@graphql-tools/merge';
import { getProfileTypeDef, modelTypeDef, baseTypeDef } from './typeDefs';
import { getProfile } from './resolvers';

export const typeDefs = mergeTypeDefs([baseTypeDef, modelTypeDef, getProfileTypeDef]);

export const resolvers = {
  Query: {
    getProfile,
  },
  Mutation: {},
};
