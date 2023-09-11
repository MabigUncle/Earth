class JsUtil{

    // 导出生成json文件
    static downloadJson(data, fileName) {
        let name = fileName || 'data.json';
        if(typeof data === 'object'){
            data = JSON.stringify(data);
        }
        let blob = new Blob([data], { type: "text/json;charset=utf-8" });
        FileSaver.saveAs(blob, name);
    }

    // 导出生成文本
    static downloadText(data, fileName) {
        let name = fileName || 'data.txt';
        if(typeof data === 'object'){
            data = JSON.stringify(data);
        }
        let blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, name);
    }
}

export default JsUtil;