/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { mergeTypeDefs } from '@graphql-tools/merge';
import {
  getProfileTypeDef,
  modelTypeDef,
  baseTypeDef,
  enumTypeDef,
  getTimeTableTypeDef,
  getCourseBatchStudentsTypeDef,
  attendanceEntryTypeDef,
} from './typeDefs';
import { getProfile, getTimetable, getCourseBatchStudents, attendanceEntry } from './resolvers';

export const typeDefs = mergeTypeDefs([
  baseTypeDef,
  enumTypeDef,
  modelTypeDef,
  getProfileTypeDef,
  getTimeTableTypeDef,
  getCourseBatchStudentsTypeDef,
  attendanceEntryTypeDef,
]);

export const resolvers = {
  Query: {
    getProfile,
    getTimetable,
    getCourseBatchStudents,
  },
  Mutation: {
    attendanceEntry,
  },
};
