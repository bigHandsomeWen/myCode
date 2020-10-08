$(function () {
    var form = layui.form;
    var layer = layui.layer;
   // 表单验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称长度必须在1 ~ 6个字符之间！';
            }
        }
    })

    getUserInfo();

    //获取用户的基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                form.val('formUserInfo', res.data);
            }
        })
    }

    //更新用户的基本信息
    $('#user_info').on('submit', function (e) {
        e.preventDefault();
        // 获取表单数据
        var data = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })

    // 点击重置按钮初始化页面
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        getUserInfo();
    })
})