import AuditLogSchema from "../model/AuditLogSchema.js";



/**
 * Logs an audit action
 * @param {Object} options
 * @param {Object} options.user 
 * @param {String} options.action 
 * @param {String} options.targetType
 * @param {String|ObjectId} options.targetId 
 * @param {String} [options.details] 
 * @param {String} [options.ip] 
 */
export const logAudit = async ({ user, action,userName, targetType, targetId, details, ip }) => {
  try {
    await AuditLogSchema.create({
      userId: user,
      userName: `${user.firstName} ${user.lastName}`,
      action,
      targetType,
      targetId,
      details,
      ipAddress: ip,
    });
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
};
