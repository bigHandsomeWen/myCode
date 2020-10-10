$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 渲染文章类别
    // 发起ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取文章类别失败！');
            }
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr);
            // 更新渲染
            form.render();
        }
    })

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 给文件绑定change事件
    $('#coverFile').on('change', function (e) {
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    var state = '已发布';

    // 给存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 给表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //创建一个FormData对象
        var fd = new FormData($(this)[0]);
        // console.log(fd);
        /* fd.forEach(function (v, k) {
            console.log(v, k);
        })  */
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob);
                // 发布新文章
                postNewArt(fd);
            })
    })

    function postNewArt(formdata) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: formdata,
            processData: false,
            contentType: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg(res.message, {
                    icon: 1,
                    time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
                }, function () {
                    location.href = 'art_list.html';
                });
            }
        })
    }
})