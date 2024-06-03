import * as bcrypt from 'bcrypt';

/**
 * Compare and validate passwords
 * @param {string} password - Correct password hash
 * @param {string} candidatePassword - Candidate password
 * @returns {boolean} - Valid password or not
 */
export const comparePassword = async (
  password: string,
  candidatePassword: string,
): Promise<boolean> => {
  const isValidPassword = await bcrypt.compare(candidatePassword, password);
  return isValidPassword;
};
