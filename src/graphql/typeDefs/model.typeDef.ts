/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import gql from 'graphql-tag';

export const modelTypeDef = gql`
  type Department {
    id: ID!
    name: String!
    abbreviation: String!
    created_at: String
    updated_at: String
  }

  type Staff {
    id: ID!
    user_id: ID!
    email: String!
    name: String!
    roll_no: Int!
    phone_no: String
    profile_image: String
    date_of_birth: String
    department: Department
    designation: String
    gender: String
    created_at: String
    updated_at: String
  }
`;
