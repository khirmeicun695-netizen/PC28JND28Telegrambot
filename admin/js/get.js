function getOs() { //获取操作系统
    var userAgent = navigator.userAgent.toLowerCase();
    var name = 'Unknown';
    var version = 'Unknown';
    if (userAgent.indexOf('win') > -1) {
        name = 'Windows';
        if (userAgent.indexOf('windows nt 5.0') > -1) {
            version = 'Windows 2000';
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
            version = 'Windows XP';
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
            version = 'Windows Vista';
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
            version = 'Windows 7';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
            version = 'Windows 8';
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
            version = 'Windows 8.1';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
            version = 'Windows 10';
        } else {
            version = 'Unknown';
        }
    } else if (userAgent.indexOf('iphone') > -1) {
        name = 'Iphone';
    } else if (userAgent.indexOf('mac') > -1) {
        name = 'Mac';
    } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
        name = 'Unix';
    } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
            name = 'Android';
            version = 'Android';
        } else {
            name = 'Linux';
            version = 'Linux';
        }
    } else {
        name = 'Unknown';
    }
    return { name, version };
}

function GetIpBysouhu(){ //获取ip，登录地址
    this.cip = returnCitySN["cip"]; //ip地址
    this.cid = returnCitySN["cid"]; //邮编
    this.cname = returnCitySN["cname"]; //地名
}

/*document.addEventListener('scroll',function (a) {
    console.log(a);
    console.log(a.timeStamp);
    if (a.timeStamp>1000) {
        document.getElementById('nav').style= 'disable'
    }else{
        document.getElementById('nav').style= 'disable:false'

    }
})*/
/*var box = document.getElementById('box')
document.addEventListener('mousemove',function (a) {
    
    console.log("x轴坐标："+a.pageX+"，x轴坐标："+a.pageY);
    var x = a.pageX;
    var y = a.pageY;
    box.style.left = x+'px';
    box.style.top = y+'px';
    //document.write("x轴坐标："+a.pageX+"，x轴坐标："+a.pageY)
})*/

const getIpBysouhu = new GetIpBysouhu(); //创建实例
console.log(getOs().version);
console.log(getIpBysouhu.cip);
console.log(getIpBysouhu.cname);
document.write("获取成功")

console.log(window)
console.dir(window)