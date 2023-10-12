export function checkEmailValidation(email) {
    if (!email) return false;  // Check if email is empty or null or undefined
    const emailParts = email.split('@');
    if (emailParts.length !== 2 || emailParts[1].includes('..')) return false;
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]{2,}$/;
    return regex.test(email);
}
