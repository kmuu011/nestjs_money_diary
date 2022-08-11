const startScript = '<script>';
const endScript = '</script>';

const scriptTagRemover = async (data: string|object, is_string: boolean, script: string): Promise<string|object> => {
    if(is_string){
        while(data.toString().toLowerCase().indexOf(script) !== -1){
            const start_idx: number = data.toString().toLowerCase().indexOf(script);
            const end_idx: number = start_idx + script.length;
            data = data.toString().substring(0, start_idx) + data.toString().substring(end_idx, JSON.stringify(data).length);
        }
    }else{
        while(JSON.stringify(data).toLowerCase().indexOf(script) !== -1){
            const start_idx: number = JSON.stringify(data).toLowerCase().indexOf(script);
            const end_idx: number = start_idx + script.length;
            data = JSON.parse(JSON.stringify(data).substring(0, start_idx) + JSON.stringify(data).substring(end_idx, JSON.stringify(data).length));
        }
    }

    return data;
};

export default {
    check : async (data: object): Promise<void> => {
        if (data === undefined) return;

        for (const k in data) {
            if (!data.hasOwnProperty(k)) continue;

            if (data[k] === undefined || data[k].constructor === Number || data[k].constructor === Boolean) {
                continue;
            }

            let isString = !(data[k].constructor === Array || data[k].constructor === Object);

            data[k] = await scriptTagRemover(data[k], isString, startScript);
            data[k] = await scriptTagRemover(data[k], isString, endScript);
        }
    }

}