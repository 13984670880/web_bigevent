$(function() {
    var layer = layui.layer;
    var form = layui.form;
    layer.load(3, { time: 1500 });
    setTimeout(() => {
        // 调用获取文章分类的列表函数
        initArtCateList();
    }, 2000);
    // 1.获取文章分类的列表
    function initArtCateList() {
        // 发起 Ajax 数据请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 2.为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        // alert('ok')
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    // 3.通过代理的形式，为添加分类 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // console.log('ok');
        // 发起 Ajax 请求数据
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！', { icon: 2, time: 1500 });
                }
                // 返回用户的提示框
                layer.msg('新增文章分类成功！', { icon: 1, time: 1500 });
                // 刷新列表数据
                initArtCateList();
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    });
    // 4.通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起 Ajax 请求获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                // 调用 from.val() 快速为表单赋值
                // 属性 lay-filter="form-edit" 对应的值
                // 第二个参数中的键值是表单元素对应的 name 和 value
                form.val('form-edit', res.data);
            }
        })
    });
    // 5.通过代理的形式，为修改分类 form-edit 表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起 Ajax 请求数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！', { icon: 2, time: 1500 });
                }
                // 返回用户的提示框
                layer.msg('更新分类信息成功！', { icon: 1, time: 1500 });
                // 刷新列表数据
                initArtCateList();
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit);
            }
        })
    });
    // 6.通过代理的形式，为删除按钮 btn-delete 绑定 click 事件
    $('tbody').on('click', '.btn-delete', function() {
        // console.log('ok');
        // 获取文章列表的 id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除
        layer.confirm('您确认要删除?', { icon: 3, title: '温馨提示' }, function(index) {
            //do something
            // 发起 Ajax 数据请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！', { icon: 2, time: 2000 });
                    }
                    layer.msg('删除文章分类成功！', { icon: 1, time: 2000 });
                    // 刷新列表数据
                    initArtCateList();
                    // 关闭对应的弹出层
                    layer.close(index);
                }
            })
        })
    })
})