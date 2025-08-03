import supabase from '../../utils/supabaseClient.js';

/**
 * Write an entry to the audit_logs table in Supabase. Each entry records
 * the user performing the action, the platform or subsystem affected,
 * a free‑form action string and optional metadata as JSON. Use this to
 * trace actions such as connecting accounts, posting content, or changing
 * settings.
 *
 * @param {string} user_id Supabase user identifier
 * @param {string} platform Platform or system affected
 * @param {string} action Description of the action performed
 * @param {object} [metadata] Additional data to record
 */
export async function logAudit(user_id, platform, action, metadata = {}) {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({ user_id, platform, action, metadata, timestamp: new Date().toISOString() });
    if (error) {
      console.error('Failed to log audit:', error);
    }
  } catch (err) {
    console.error('Unexpected error while logging audit:', err);
  }
}