$(function () {
    // 表单验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            var pwd = $('[name=oldPwd]').val()
            if (pwd === value) {
                return '新密码不能与原密码相同！'
            }
        },
        rePwd: function (value) {
            var pwd = $('[name=newPwd]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 给表单绑定submit事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //获取表单数据
        var data = $(this).serialize();
        // 重置密码
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
}) 