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
  leaveRequestTypeDef,
  leaveCategoryTypeDef,
  leaveRequestsTypeDef,
  leaveIntimationTypeDef,
  leaveApprovalTypeDef,
} from './typeDefs';
import {
  getProfile,
  getTimetable,
  getCourseBatchStudents,
  attendanceEntry,
  requestLeave,
  getLeaveCategories,
  getLeaveRequests,
  cancelLeaveRequest,
  getLeaveIntimations,
  getLeaveApprovals,
  reviewLeaveRequest,
} from './resolvers';

export const typeDefs = mergeTypeDefs([
  baseTypeDef,
  enumTypeDef,
  modelTypeDef,
  getProfileTypeDef,
  getTimeTableTypeDef,
  getCourseBatchStudentsTypeDef,
  attendanceEntryTypeDef,
  leaveRequestTypeDef,
  leaveCategoryTypeDef,
  leaveRequestsTypeDef,
  leaveIntimationTypeDef,
  leaveApprovalTypeDef,
]);

export const resolvers = {
  Query: {
    getProfile,
    getTimetable,
    getCourseBatchStudents,
    leaveCategories: getLeaveCategories,
    leaveRequests: getLeaveRequests,
    leaveIntimations: getLeaveIntimations,
    leaveApprovals: getLeaveApprovals,
  },
  Mutation: {
    attendanceEntry,
    requestLeave,
    cancelLeaveRequest,
    reviewLeaveRequest,
  },
};
