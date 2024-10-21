window.listen_http = false
window.modifyData = false


// 判断购买物品是否为烈火
isFire = function (e){
    return e?.sdTargetData?.sd_id === 1;
}

// 修改请求数据
window.modifyRequestData = [
    // 修改无尽购买烈火数量，我们可以使用callback来判断购买的物品是否是烈火
    {
        key: "sdTargetData.num",  // json path
        modified: 1000,  //
        callback: isFire, // 回调函数，对数据的一些逻辑判断等，返回布尔类型
    }
]

// 修改响应数据
window.modifyResponseData = [
    // 修改战机血量
    {
        key: "hp",  // json path
        modified: 5000000,  // 修改后数据
        callback: () => true, // 回调函数，对数据的一些逻辑判断等，返回布尔类型
        isRestoreDataInRequest: true,  // 是否在提交时还原数据，避免检测
        restoreKey: "hp", // 还原数据的key，用于还原数据
    },
    // 修改战机伤害
    {
        key: "engineDmg",  // json path
        modified: 100000,  // 修改后数据
        callback: () => true, // 回调函数，对数据的一些逻辑判断等，返回布尔类型
        isRestoreDataInRequest: true,  // 是否在提交时还原数据，避免检测
        restoreKey: "engineDmg", // 还原数据的key，用于还原数据
    },
    // 修改副武器伤害
    {
        key: "weaponDmg",  // json path
        modified: 100000,  // 修改后数据
        callback: () => true, // 回调函数，对数据的一些逻辑判断等，返回布尔类型
        isRestoreDataInRequest: true,  // 是否在提交时还原数据，避免检测
        restoreKey: "weaponDmg", // 还原数据的key，用于还原数据
    },
    // 修改僚机伤害
    {
        key: "wingmanDmg",  // json path
        modified: 100000,  // 修改后数据
        callback: () => true, // 回调函数，对数据的一些逻辑判断等，返回布尔类型
        isRestoreDataInRequest: true,  // 是否在提交时还原数据，避免检测
        restoreKey: "wingmanDmg", // 还原数据的key，用于还原数据
    }
]


getValueByPath = function (obj, path) {
    const keys = path.split('.');
    let result = obj;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result = result[key];
        if (result === undefined) {
            return undefined;
        }
    }
    return result;
}

setValueByPath = function (obj, path, value) {
    const keys = path.split('.');
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!obj[key]) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keys[keys.length - 1]] = value;
}

modify = function (type, e) {
    if (!window.modifyData) return e;
    if(type === 'req'){
        const data = window.modifyRequestData;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.callback(e)) {
                setValueByPath(e, item.key, item.modified)
            }
        }
    }else if(type === 'res'){
        const data = window.modifyResponseData;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.callback(e)) {
                if(item.isRestoreDataInRequest){
                    // 判断modifyRequestData是否存在key
                    if(!window.modifyRequestData.find(reqItem => reqItem.key === item.restoreKey)){
                        // 添加
                        window.modifyRequestData.push({
                            key: item.restoreKey,  // json path
                            modified: getValueByPath(e, item.key),  // 获取原始数据
                            callback: ()=>true, // 回调函数，对数据的一些逻辑判断等，返回布尔类型
                        })
                    }
                }
                setValueByPath(e, item.key, item.modified)
            }
        }

    }
    return e;
}


const heart_cmd = [
    16, 1016
]

sendRequest = function (uri, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("POST", "http://localhost:2026/" + uri);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(data);
    });
}

makeSyncRequest = async function (uri, data) {
    try {
        let response = await sendRequest(uri, data);
        return response;
    } catch (error) {
        return 'Request failed:' + error;
    }
}


let _stringify = JSON['stringify'];
JSON['stringify'] = function (e) {
    if (e == void 0) return e;
    let __s = _stringify(e)
    __s = JSON.parse(__s)
    if (__s?.head?.uid && window.listen_http) {
        let data = _stringify(e);
        makeSyncRequest('req', data)
    }
    e = modify('req', e)
    return _stringify(e)
}


let _parse = JSON['parse'];
JSON['parse'] = function (e) {
    if (e == void 0) return e;
    let __s = _parse(e)
    if (__s?.head && !__s?.head?.uid && window.listen_http) {
        let data = e;
        makeSyncRequest('res', data)
    }
    __s = modify('res', __s)
    return __s;
}


wx.showModal({
    title: 'js-hook',
    content: '是否要捕获HTTP数据(你需要开启js-hook-server才可以捕获)？',
    success (res) {
        if (res.confirm) {
            window.listen_http = true
            wx.showLoading({
                title: '检测js-hook-server状态中',
            })
            const interval = setInterval(() => {
                sendRequest('').then(data => {
                    if (data == 'ok') {
                        clearInterval(interval)
                        wx.hideLoading()
                        wx.showToast({
                            title: 'hook成功！',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            }, 1500)
        } else if (res.cancel) {
            window.listen_http = false
            wx.showToast({
                title: 'hook成功！',
                icon: 'success',
                duration: 2000
            })
        }
    }
})



