/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import { Request } from 'express';
import { Leave, Staff } from '@/src/models';
import { LeaveStatus } from '@/src/config/enum.config';
import logger from '@/src/utils/logger';

interface Context {
  req: Request;
}

interface CancelLeaveArgs {
  leave_id: number;
}

export const cancelLeaveRequest = async (
  _: any,
  args: CancelLeaveArgs,
  context: Context,
) => {
  try {
    const authUser = (context.req as any).user;
    if (!authUser?.id) {
      throw new Error('Unauthorized: Invalid or missing token.');
    }

    const staff = await Staff.findOne({ where: { user_id: authUser.id } });
    if (!staff) {
      throw new Error('Staff not found.');
    }

    const leave = await Leave.findOne({
      where: {
        id: args.leave_id,
        staff_id: staff.id,
        withdraw: false,
      },
    });

    if (!leave) {
      throw new Error('Leave request not found.');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new Error('Only pending leave requests can be cancelled.');
    }

    leave.withdraw = true;
    await leave.save();

    return {
      success: true,
      leave_id: leave.id,
    };
  } catch (err: any) {
    const error = err?.message || 'Unknown error';
    logger.error(`Error in cancelLeaveRequest: ${error}`);
    throw new Error(error);
  }
};
