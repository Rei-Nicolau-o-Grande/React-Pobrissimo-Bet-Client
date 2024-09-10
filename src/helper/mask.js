export const maskMoneyDisplay = (value) => {
    if (!value) return '';

    let numericValue = value.replace(/\D/g, '');
    numericValue = numericValue.replace(/^0+(?!$)/, '');
    while (numericValue.length < 3) {
        numericValue = '0' + numericValue;
    }
    numericValue = numericValue.replace(/(\d{2})$/, ',$1');
    numericValue = numericValue.replace(/(\d)(?=(\d{3})+\,)/g, '$1.');

    return numericValue;
}

export const unmaskMoney = (value) => {
    if (!value) return '';

    let unmaskedValue = value.replace(/\./g, ''); // Remove os pontos
    unmaskedValue = unmaskedValue.replace(',', '.'); // Substitui a vírgula por ponto

    return unmaskedValue;
}