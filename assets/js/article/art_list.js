$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 初始化变量
    var p = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的状态
    }

    getData();
    // 获取数据
    function getData() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        })
    }

    // 分页的函数
    function renderPage(total) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: p.pagesize,
                curr: p.pagenum,
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 4, 6, 8, 10],
                jump: function (obj, first) {
                    p.pagesize = obj.limit;
                    p.pagenum = obj.curr;
                    //首次不执行
                    if (!first) {
                        getData();
                    }
                }
            });
        });
    }

    // 时间过滤器
    template.defaults.imports.dateFilter = function (data) {
        var dt = new Date(data);
        var y = dt.getFullYear();
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());
        var h = addZero(dt.getHours());
        var mn = addZero(dt.getMinutes());
        var s = addZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mn + ':' + s;
    }

    // 补零
    function addZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 给删除按钮绑定事件委派
    $('tbody').on('click', '.layui-btn-danger', function () {
        // 获取id
        var id = $(this).attr('id');
        // 提示是否删除
        layer.confirm('是否确定删除？', { icon: 2, title: '提示' }, function (index) {
            // 发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg(res.message);
                    if ($('.layui-btn-danger').length === 1) {
                        p.pagenum = p.pagenum === 1 ? p.pagenum : p.pagenum - 1;
                    }
                    // 重新渲染
                    getData();
                }
            })
            layer.close(index);
        });
    })

    // 获取所有分类
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类列表失败！');
            }
            var htmlStr = template('tel-data', res);
            $('[name=cate_id]').html(htmlStr);
            form.render()
        }
    })

    // 给筛选按钮区域绑定submit事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        // 收集表单数据
        p.cate_id = $('[name=cate_id]').val();
        p.state = $('[name=state]').val();
        console.log($('[name=cate_id]').val());
        // 渲染页面
        getData();
    })
})