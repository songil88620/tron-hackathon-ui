export const getCurrentDate = () => {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = String(today.getFullYear()).slice(-2);
    var currentDate = day + '.' + month + '.' + year;
    return currentDate;
}

export const beatifyAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
}