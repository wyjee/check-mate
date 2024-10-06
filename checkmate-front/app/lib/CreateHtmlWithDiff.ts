export const createHTMLWithDiff = (diff: [number, string][]) => {
    let result = '';

    diff.forEach(([operation, char]) => {
        switch (operation) {
            case -1: // 삭제된 경우
                result += `<span class="underline-red">${char}</span>`;
                break;
            case 1: // 추가된 경우
                result += `<span class="underline-green">${char}</span>`;
                break;
            case 0: // 변화 없는 경우
                result += char;
                break;
        }
    });

    return result;
}