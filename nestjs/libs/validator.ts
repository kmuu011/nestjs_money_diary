import {Message} from "./message";
import {FileType, ValidatorType, ValidatorTypeObj} from "src/common/type/type";

export const type: ValidatorTypeObj = {
    img : {
        reg: /^jpg$|^jpeg$|^png$/,
        msg: 'jpg, jpeg, png 형식의 파일만 업로드 할 수 있습니다.'
    },
}

export const file = (files: any[], maxSize: number, type: ValidatorType): FileType[] => {
    const fileList: FileType[] = [];

    for(let i=0 ; i<files.length ; i++){
        const f = files[i];

        if(f === undefined){
            throw Message.INVALID_PARAM('file');
        }

        let fileType = f.originalname.substring(f.originalname.lastIndexOf('.')+1);
        fileType = fileType.toLowerCase();
        const fileName = f.originalname.substring(0, f.originalname.lastIndexOf('.'));
        const fileBuffer = f.buffer;
        const fileSize = f.size;

        if(fileSize/1024/1024 > maxSize){
            throw Message.FILE_TOO_LARGE(maxSize);
        }

        if(type !== undefined){
            if(!(type.reg).test(fileType)){
                throw Message.CUSTOM_ERROR(type.msg);
            }
        }

        fileList.push({
            fileType, fileName, fileBuffer, fileSize
        });
    }

    return fileList;
}
