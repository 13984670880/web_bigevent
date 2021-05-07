$(function() {
    // 加载 layui 的 layer 模块
    var layer = layui.layer;
    var form = layui.form;
    // 调用文章类别的方法
    initCate();
    // 调用 initEditor() 方法，初始化富文本编辑器：
    // 初始化富文本编辑器
    initEditor();
    // 定义加载文章类别的方法
    function initCate() {
        // 发起 Ajax 数据请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！', { icon: 2, time: 2000 });
                }
                // layer.msg('获取文章分类列表成功！', { icon: 1, time: 2000 });
                // 调用模板引擎，来渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('#cate_id').html(htmlStr);
                // 一定记得调用  form.render() 方法来渲染更新全部
                form.render();
            }
        })
    };
    // 实现基本裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    // 监听 coverFile 的 change 事件，获取用户选择文件的列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 3.将文章的发布状态存到 fd 中
        fd.append('state', art_state);
        // 4. 将裁剪后的图片， 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件存储到 fd 中
                fd.append('cover_img', blob);
                // 6.发起 Ajax 数据请求
                publishArticle(fd);
            })
    });
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！', { icon: 2, time: 2000 })
                }
                layer.msg('发布文章成功！', { icon: 1, time: 2000 });
                // 发布文章成功后，跳转到文章列表页面
                setTimeout(() => {
                    window.location.href = '/article/art_list.html';
                }, 1500);
            }
        })
    }
})