$.ajaxPrefilter(function (options) {
    // console.log(options);
    // url根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: sessionStorage.getItem('token')
        }
    }

    // 如果身份认证失败强制跳转到登陆页面
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空本地的token
            sessionStorage.removeItem('token');
            // 跳转到登录页面
            location.href = 'login.html';
        }
    }
})