export default function getEmailIds(rows, input) {
    if (!input || !rows || rows.length === 0) return [];

    // set a regex to match ' ' and ',' and ', '
    const separatorRegex = /[ ,]+/;
    
    // use regex to split emails string
    const inputEmails = input.split(separatorRegex).map(email => email.trim());

    const matchedIds = rows
        .filter(row => inputEmails.includes(row.participantInfo.email))
        .map(row => row._id);

    return matchedIds;
}
