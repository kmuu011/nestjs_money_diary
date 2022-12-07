export const dataExpect = (keyInfoList, itemList) => {
    for (const item of itemList) {
        for (const keyInfo of keyInfoList) {
            switch (keyInfo.type) {
                case 'string':
                    expect(item[keyInfo.key].constructor === String).toBeTruthy();
                    break;
                case 'number':
                    expect(Number(item[keyInfo.key]).constructor === Number).toBeTruthy();
                    break;
            }
        }
    }
}