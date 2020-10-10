$(function () {
    var layer = layui.layer;
    var form = layui.form;
    getArtCateList()
    // 获取文章分类列表
    function getArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                var htmlStr = template('dialog-data', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var index = null;
    // 给添加类别绑定点击事件
    $('#btnAddCate').on('click', function () {
        index = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '300px'],
            content: $("#dialog-add").html()
        });
    })

    // 给添加类别绑定事件委托
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        // 收集表单数据
        var data = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加文章类别失败！');
                }
                layer.msg(res.message);
                getArtCateList();
                layer.close(index);
            }
        })
    })

    // 给编辑按钮绑定事件委托
    $('tbody').on('click', '.btn-edit', function () {
        index = layer.open({
            type: 1,
            title: '修改文章类别',
            area: ['500px', '300px'],
            content: $("#dialog-edit").html()
        });

        // 获取当前数据的id
        var id = $(this).attr('id')
        // 根据 Id 获取文章分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！');
                }
                form.val('form-edit', res.data);
            }
        })
    })

    // 给编辑表单绑定事件委托
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // 获取表单数据
        var data = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！');
                }
                layer.msg(res.message);
                // 关闭弹层
                layer.close(index);
                // 重新渲染
                getArtCateList();
            }
        })
    })

    // 给删除按钮绑定事件委托
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前删除按钮的id
        var id = $(this).attr('id');
        // 提示是否确定删除
        layer.confirm('是否确定删除？', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 重新渲染
                    getArtCateList();
                }
            })
            layer.close(index);
        });
    })
})