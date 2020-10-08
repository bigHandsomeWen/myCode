$(function () {
    var layer = layui.layer;

    getUserInfo()

    //点击退出按钮回到登录页面
    $('#logout').on('click', function () {
        //提示是否退出
        layer.confirm('是否确定退出？', { icon: 3, title: '提示' }, function (index) {
            //清除token
            sessionStorage.removeItem('token');
            //返回到登录页面
            location.href = 'login.html';
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    // 发起ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            render(res.data);
        }
    })
}

// 渲染页面
function render(data) {
    var name = data.nickname || data.username;
    // 渲染文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    // 判断用户是否上传了图片
    if (data.user_pic === null) {
        // 截取name的第一个字母并转化为大写
        var initial = name.substr(0, 1).toUpperCase();
        // 渲染图片
        $('.text-avatar').html(initial).show();
        $('.layui-nav-img').hide();
    } else {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', data.user_pic).show();
    }
}