export function checkPhoneNumValidation(phoneNum) {
    const regex = /^(\+)?[\d\s]([-]?[\d\s]+)*$/;
    return regex.test(phoneNum);
}