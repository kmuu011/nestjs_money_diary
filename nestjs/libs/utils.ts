const textReplace = async (data, key, from, to): Promise<void> => {
    if(data[key] === undefined || data[key] === null) return;

    if((data[key].constructor === Array && data[key].length !== 0) || data[key].constructor === Object){
        await dataSortForTextReplace(data[key], from, to);
    }else if(data[key].constructor === String){
        data[key] = data[key].toString().replace(from, to);
    }
};

const dataSortForTextReplace = async (data, from, to): Promise<void> => {
    if(data === undefined) return;

    if(data.constructor === Array && data.length !== 0){
        for(let i=0 ; i<data.length ; i++){
            await textReplace(data, i, from, to);
        }
    }else if(data.constructor === Object && Object.keys(data).length !== 0){
        for(const k in data){
            if(!data.hasOwnProperty(k)) continue;
            await textReplace(data, k, from, to);
        }
    }
};

export default {
    activeQuestionMark: async (data): Promise<void> => {
        await dataSortForTextReplace(data, /\？/g, '?');
    },

    deActiveQuestionMark: async (data): Promise<void> => {
        await dataSortForTextReplace(data, /\?/g, '？');
    }
};
