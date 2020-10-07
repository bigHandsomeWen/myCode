$(function () {
    // 点击去注册链接切换页面
    $('#link_reg').on('click', function () {
        // 登录页面隐藏
        $('.login-box').hide();
        // 注册页面显示
        $('.reg-box').show();
    })

    // 点击去登录链接切换页面
    $('#link_login').on('click', function () {
        // 注册页面隐藏
        $('.reg-box').hide();
        // 登录页面显示
        $('.login-box').show();
    })

    // 表单验证规则
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 注册功能实现
    $('#form_reg').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 获取表单数据
        var data = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！');
                // 模拟点击事件
                $('#link_login').click();
            }
        })
    })

    var layer = layui.layer;
    // 登录功能实现
    $('#form_login').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 获取表单数据
        var data = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // 将登录成功获得的token值放入本地储存中
                sessionStorage.setItem('token', res.token);
                // 跳转到index页面
                location.href = 'index.html';
            }
        })
    })
})